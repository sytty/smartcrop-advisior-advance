import { useState, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';
import { generateSubsidyEligibility, generateSubsidyApplications } from '@/lib/mockData.js';
import mlModelService from '@/lib/mlModelService.js';

export const useSubsidyVerification = () => {
  const [loading, setLoading] = useState(false);

  const getEligibilityCriteria = async () => {
    try {
      const records = await pb.collection('subsidy_eligibility').getFullList({ $autoCancel: false });
      return records.length > 0 ? records : generateSubsidyEligibility();
    } catch (error) {
      console.warn('Failed to fetch eligibility from PB, using mock data', error);
      return generateSubsidyEligibility();
    }
  };

  const checkEligibility = useCallback(async (farmerId, landSize, cropType, income) => {
    setLoading(true);
    try {
      const criteriaList = await getEligibilityCriteria();
      const criteria = criteriaList.find(c => c.crop_type === cropType);
      
      if (!criteria) {
        return { isEligible: false, failed: ['Crop type not eligible for subsidy'] };
      }

      const failed = [];
      if (landSize < criteria.min_land_size || landSize > criteria.max_land_size) {
        failed.push(`Land size must be between ${criteria.min_land_size} and ${criteria.max_land_size} hectares`);
      }
      if (income > criteria.income_threshold) {
        failed.push(`Income exceeds threshold of ₹${criteria.income_threshold.toLocaleString()}`);
      }

      // Check previous history (mocked for now)
      const hasRecentSubsidy = false; 
      if (hasRecentSubsidy) {
        failed.push('Already received subsidy in the current cycle');
      }

      const scoring = await mlModelService.infer('subsidy_verification', {
        farmerId,
        landSize,
        cropType,
        income,
      });

      return {
        isEligible: failed.length === 0,
        failed,
        criteria,
        eligibilityScore: scoring.eligibilityScore,
        riskBand: scoring.riskBand,
        modelConfidence: scoring.confidence,
      };
    } catch (error) {
      console.error('Eligibility check failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateSubsidyAmount = useCallback(async (landSize, cropType) => {
    try {
      const criteriaList = await getEligibilityCriteria();
      const criteria = criteriaList.find(c => c.crop_type === cropType);
      
      if (!criteria || !landSize) return { amount: 0, capped: false, breakdown: null };

      // Assuming base cost per hectare is ₹100,000 for calculation
      const baseCostPerHectare = 100000;
      const rawAmount = landSize * baseCostPerHectare * (criteria.subsidy_rate / 100);
      const capped = rawAmount > criteria.max_subsidy_amount;
      const finalAmount = capped ? criteria.max_subsidy_amount : rawAmount;

      return {
        amount: finalAmount,
        capped,
        breakdown: {
          rate: criteria.subsidy_rate,
          maxCap: criteria.max_subsidy_amount,
          rawAmount
        }
      };
    } catch (error) {
      console.error('Calculation failed:', error);
      return { amount: 0, capped: false, breakdown: null };
    }
  }, []);

  const submitApplication = useCallback(async (applicationData, documents) => {
    setLoading(true);
    try {
      // Create application record
      const appRecord = await pb.collection('subsidy_applications').create({
        farmer_id: applicationData.farmer_id,
        status: 'submitted',
        land_size: applicationData.land_size,
        crop_type: applicationData.crop_type,
        yield_data: applicationData.yield_data,
        bank_account: applicationData.bank_account,
        subsidy_amount: applicationData.subsidy_amount,
        eligibility_verified: applicationData.eligibility_verified,
        application_date: new Date().toISOString()
      }, { $autoCancel: false });

      // Upload documents
      for (const doc of documents) {
        const formData = new FormData();
        formData.append('application_id', appRecord.id);
        formData.append('document_type', doc.type);
        formData.append('file', doc.file);
        formData.append('uploaded_at', new Date().toISOString());
        
        await pb.collection('subsidy_documents').create(formData, { $autoCancel: false });
      }

      return appRecord;
    } catch (error) {
      console.error('Submission failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getApplications = useCallback(async (farmerId, adminView = false) => {
    setLoading(true);
    try {
      const filter = adminView ? '' : `farmer_id = "${farmerId}"`;
      const records = await pb.collection('subsidy_applications').getFullList({
        filter,
        sort: '-application_date',
        expand: 'farmer_id',
        $autoCancel: false
      });
      return records.length > 0 ? records : (adminView ? generateSubsidyApplications(15) : generateSubsidyApplications(3));
    } catch (error) {
      console.warn('Failed to fetch applications, using mock data', error);
      return adminView ? generateSubsidyApplications(15) : generateSubsidyApplications(3);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApplicationStatus = useCallback(async (applicationId, newStatus, adminNotes) => {
    setLoading(true);
    try {
      const record = await pb.collection('subsidy_applications').update(applicationId, {
        status: newStatus,
        admin_notes: adminNotes
      }, { $autoCancel: false });
      return record;
    } catch (error) {
      console.error('Status update failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyDocuments = useCallback(async (applicationId) => {
    try {
      const docs = await pb.collection('subsidy_documents').getFullList({
        filter: `application_id = "${applicationId}"`,
        $autoCancel: false
      });
      const types = docs.map(d => d.document_type);
      const required = ['land_certificate', 'id_proof', 'bank_statement'];
      const missing = required.filter(r => !types.includes(r));
      
      return {
        verified: missing.length === 0,
        missing,
        documents: docs
      };
    } catch (error) {
      console.error('Document verification failed:', error);
      return { verified: false, missing: [], documents: [] };
    }
  }, []);

  return {
    loading,
    checkEligibility,
    calculateSubsidyAmount,
    submitApplication,
    getApplications,
    updateApplicationStatus,
    verifyDocuments
  };
};