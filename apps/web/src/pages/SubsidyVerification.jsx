import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useSubsidyVerification } from '@/hooks/useSubsidyVerification.js';
import GlassCard from '@/components/GlassCard.jsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SubsidyEligibilityChecker from '@/components/SubsidyEligibilityChecker.jsx';
import DocumentUploadZone from '@/components/DocumentUploadZone.jsx';
import SubsidyCalculator from '@/components/SubsidyCalculator.jsx';
import { useTranslation } from 'react-i18next';

const cropTypes = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize'];

const SubsidyVerification = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { checkEligibility, calculateSubsidyAmount, submitApplication, loading } = useSubsidyVerification();
  
  const [formData, setFormData] = useState({
    landSize: '',
    cropType: '',
    yieldData: '',
    bankAccount: '',
    income: 400000 // Mocked income for demo
  });
  
  const [documents, setDocuments] = useState({
    land_certificate: null,
    id_proof: null,
    bank_statement: null
  });

  const [eligibility, setEligibility] = useState({ isEligible: false, failed: [], criteria: null });
  const [calculation, setCalculation] = useState(null);

  useEffect(() => {
    const runChecks = async () => {
      if (formData.cropType) {
        const elig = await checkEligibility(
          currentUser?.id, 
          parseFloat(formData.landSize) || 0, 
          formData.cropType, 
          formData.income
        );
        setEligibility(elig);

        const calc = await calculateSubsidyAmount(parseFloat(formData.landSize) || 0, formData.cropType);
        setCalculation(calc);
      }
    };
    runChecks();
  }, [formData.landSize, formData.cropType, formData.income, currentUser, checkEligibility, calculateSubsidyAmount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDocUpload = (type, file) => {
    setDocuments(prev => ({ ...prev, [type]: file }));
  };

  const handleDocRemove = (type) => {
    setDocuments(prev => ({ ...prev, [type]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!eligibility.isEligible) {
      toast.error(t('admin.subsidyVerification.notEligible'));
      return;
    }

    if (!documents.land_certificate || !documents.id_proof || !documents.bank_statement) {
      toast.error(t('admin.subsidyVerification.missingDocs'));
      return;
    }

    try {
      const docsArray = Object.entries(documents).map(([type, file]) => ({ type, file }));
      
      await submitApplication({
        farmer_id: currentUser.id,
        land_size: parseFloat(formData.landSize),
        crop_type: formData.cropType,
        yield_data: parseFloat(formData.yieldData) || 0,
        bank_account: formData.bankAccount,
        subsidy_amount: calculation.amount,
        eligibility_verified: true
      }, docsArray);

      toast.success(t('admin.subsidyVerification.success'));
      navigate('/subsidy-portal');
    } catch (error) {
      toast.error(t('admin.subsidyVerification.error'));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet>
        <title>{t('admin.subsidyVerification.title')} - Smart Crop Advisor</title>
      </Helmet>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-[#00d4ff]" />
            {t('admin.subsidyVerification.title')}
          </h1>
          <p className="text-gray-400">{t('admin.subsidyVerification.subtitle')}</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form & Docs */}
            <div className="lg:col-span-2 space-y-8">
              <GlassCard className="p-6">
                <h3 className="text-xl font-bold text-white mb-6">{t('admin.subsidyVerification.appDetails')}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">{t('admin.subsidyVerification.farmerName')}</Label>
                    <Input disabled value={currentUser?.name || 'Guest User'} className="bg-white/5 border-white/10 text-gray-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">{t('admin.subsidyVerification.cropType')}</Label>
                    <Select value={formData.cropType} onValueChange={(val) => setFormData(prev => ({ ...prev, cropType: val }))}>
                      <SelectTrigger className="bg-black/40 border-white/10 text-white">
                        <SelectValue placeholder={t('admin.subsidyVerification.selectCrop')} />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/10">
                        {cropTypes.map(crop => (
                          <SelectItem key={crop} value={crop} className="text-white hover:bg-white/10">{crop}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">{t('admin.subsidyVerification.landSize')}</Label>
                    <Input 
                      type="number" 
                      step="0.1" 
                      name="landSize" 
                      value={formData.landSize} 
                      onChange={handleInputChange} 
                      required
                      className="bg-black/40 border-white/10 text-white placeholder:text-gray-600" 
                      placeholder="e.g. 2.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">{t('admin.subsidyVerification.expectedYield')}</Label>
                    <Input 
                      type="number" 
                      name="yieldData" 
                      value={formData.yieldData} 
                      onChange={handleInputChange} 
                      className="bg-black/40 border-white/10 text-white placeholder:text-gray-600" 
                      placeholder="e.g. 5000"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-gray-300">{t('admin.subsidyVerification.bankAccount')}</Label>
                    <Input 
                      type="text" 
                      name="bankAccount" 
                      value={formData.bankAccount} 
                      onChange={handleInputChange} 
                      required
                      className="bg-black/40 border-white/10 text-white placeholder:text-gray-600" 
                      placeholder="Enter account number for direct transfer"
                    />
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-xl font-bold text-white mb-6">{t('admin.subsidyVerification.reqDocs')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DocumentUploadZone 
                    label={t('admin.subsidyVerification.landCert')} 
                    type="land_certificate" 
                    file={documents.land_certificate} 
                    onUpload={handleDocUpload} 
                    onRemove={handleDocRemove} 
                  />
                  <DocumentUploadZone 
                    label={t('admin.subsidyVerification.idProof')} 
                    type="id_proof" 
                    file={documents.id_proof} 
                    onUpload={handleDocUpload} 
                    onRemove={handleDocRemove} 
                  />
                  <DocumentUploadZone 
                    label={t('admin.subsidyVerification.bankStatement')} 
                    type="bank_statement" 
                    file={documents.bank_statement} 
                    onUpload={handleDocUpload} 
                    onRemove={handleDocRemove} 
                  />
                </div>
              </GlassCard>
            </div>

            {/* Right Column: Eligibility & Calculator */}
            <div className="space-y-8">
              <SubsidyEligibilityChecker 
                landSize={parseFloat(formData.landSize)} 
                cropType={formData.cropType} 
                income={formData.income} 
                criteria={eligibility.criteria} 
                isEligible={eligibility.isEligible} 
                failed={eligibility.failed} 
              />
              
              <SubsidyCalculator 
                landSize={parseFloat(formData.landSize)} 
                cropType={formData.cropType} 
                calculation={calculation} 
              />

              <Button 
                type="submit" 
                disabled={loading || !eligibility.isEligible || !formData.landSize || !formData.cropType}
                className="w-full h-14 text-lg bg-gradient-electric text-white border-0 hover:brightness-110 disabled:opacity-50"
              >
                {loading ? t('admin.subsidyVerification.submitting') : (
                  <><Send className="w-5 h-5 mr-2" /> {t('admin.subsidyVerification.submit')}</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubsidyVerification;