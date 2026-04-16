import React, { useEffect, Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter as Router, useLocation } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop.jsx';
import i18n from './i18n/config.js';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { runPhase2BVerification } from './lib/verificationSuite.js';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import PageLoader from './components/PageLoader.jsx';
import { logger } from '@/lib/logger.js';

// Universal Systems Providers
import { HelpProvider } from './hooks/useHelp.jsx';
import { TutorialProvider } from './hooks/useTutorial.jsx';
import { AccessibilityProvider } from './hooks/useAccessibility.jsx';
import HelpSystem from './components/HelpSystem.jsx';
import TutorialModal from './components/TutorialModal.jsx';

// Eagerly loaded critical routes
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

// Lazy loaded routes for Performance Optimization (Code Splitting)
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const DigitalTwinDashboard = lazy(() => import('./pages/DigitalTwinDashboard.jsx'));
const PestRiskHeatmap = lazy(() => import('./pages/PestRiskHeatmap.jsx'));
const VoiceAssistant = lazy(() => import('./pages/VoiceAssistant.jsx'));
const ARFieldOverlay = lazy(() => import('./pages/ARFieldOverlay.jsx'));
const DiseaseDetectionAdvanced = lazy(() => import('./pages/DiseaseDetectionAdvanced.jsx'));
const RegionalMonitoringDashboard = lazy(() => import('./pages/RegionalMonitoringDashboard.jsx'));
const AuditDashboard = lazy(() => import('./pages/AuditDashboard.jsx'));
const ModelDriftDetection = lazy(() => import('./pages/ModelDriftDetection.jsx'));
const SubsidyVerification = lazy(() => import('./pages/SubsidyVerification.jsx'));
const SubsidyPortal = lazy(() => import('./pages/SubsidyPortal.jsx'));
const SubsidyAdmin = lazy(() => import('./pages/SubsidyAdmin.jsx'));
const EdgeComputingDashboard = lazy(() => import('./pages/EdgeComputingDashboard.jsx'));
const PricingPage = lazy(() => import('./pages/PricingPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const PasswordResetPage = lazy(() => import('./pages/PasswordResetPage.jsx'));

// Analytics Pages (Lazy)
const YieldPredictionAnalytics = lazy(() => import('./pages/YieldPredictionAnalytics.jsx'));
const SoilHealthAnalytics = lazy(() => import('./pages/SoilHealthAnalytics.jsx'));
const WeatherImpactAnalytics = lazy(() => import('./pages/WeatherImpactAnalytics.jsx'));
const CostBenefitAnalysis = lazy(() => import('./pages/CostBenefitAnalysis.jsx'));
const FarmerPerformanceMetrics = lazy(() => import('./pages/FarmerPerformanceMetrics.jsx'));
const CropComparisonAnalytics = lazy(() => import('./pages/CropComparisonAnalytics.jsx'));
const MarketPriceIntegration = lazy(() => import('./pages/MarketPriceIntegration.jsx'));
const WaterUsageOptimization = lazy(() => import('./pages/WaterUsageOptimization.jsx'));

// Futuristic Pages (Lazy)
const AICropAdvisor = lazy(() => import('./pages/AICropAdvisor.jsx'));
const DroneMonitoringSystem = lazy(() => import('./pages/DroneMonitoringSystem.jsx'));
const IoTSensorDashboard = lazy(() => import('./pages/IoTSensorDashboard.jsx'));
const PredictiveWeatherAI = lazy(() => import('./pages/PredictiveWeatherAI.jsx'));
const CropDiseaseAIDetector = lazy(() => import('./pages/CropDiseaseAIDetector.jsx'));
const SmartIrrigationSystem = lazy(() => import('./pages/SmartIrrigationSystem.jsx'));
const BlockchainCropCertification = lazy(() => import('./pages/BlockchainCropCertification.jsx'));
const AIPestManagement = lazy(() => import('./pages/AIPestManagement.jsx'));
const SatelliteImageryAnalysis = lazy(() => import('./pages/SatelliteImageryAnalysis.jsx'));
const ClimateRiskAssessment = lazy(() => import('./pages/ClimateRiskAssessment.jsx'));
const PrecisionFarmingDashboard = lazy(() => import('./pages/PrecisionFarmingDashboard.jsx'));
const CropYieldForecastingAI = lazy(() => import('./pages/CropYieldForecastingAI.jsx'));
const SoilMicrobiomeAnalysis = lazy(() => import('./pages/SoilMicrobiomeAnalysis.jsx'));
const CarbonFootprintTracker = lazy(() => import('./pages/CarbonFootprintTracker.jsx'));
const FarmerCommunityHub = lazy(() => import('./pages/FarmerCommunityHub.jsx'));

// New System Pages (Lazy)
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard.jsx'));
const HelpAndSupportPage = lazy(() => import('./pages/HelpAndSupportPage.jsx'));
const DataManagementPage = lazy(() => import('./pages/DataManagementPage.jsx'));
const IntegrationPage = lazy(() => import('./pages/IntegrationPage.jsx'));

// Documentation Layout (Lazy)
const DocumentationLayout = lazy(() => import('./components/DocumentationLayout.jsx'));
const DocumentationHub = lazy(() => import('./pages/docs/DocumentationHub.jsx'));

const AppContent = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const isPublicPage = ['/', '/pricing', '/contact'].includes(location.pathname);

  useEffect(() => {
    try {
      runPhase2BVerification();
      logger.debug('Phase 2B Verification completed successfully');
    } catch (error) {
      logger.error('Phase 2B Verification failed', error);
    }
  }, []);

  useEffect(() => {
    const isRTL = i18n.language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    if (isRTL) {
      document.body.classList.add('rtl-mode');
    } else {
      document.body.classList.remove('rtl-mode');
    }
    logger.debug('Language changed', { lang: i18n.language, isRTL });
  }, [i18n.language]);

  return (
    <>
      <Header />
      <HelpSystem />
      <TutorialModal />
      <ErrorBoundary componentName="MainRouter">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Eager Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Lazy Public Routes */}
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/password-reset" element={<PasswordResetPage />} />
            
            {/* Documentation Routes */}
            <Route path="/docs" element={<DocumentationLayout />}>
              <Route index element={<DocumentationHub />} />
              <Route path="*" element={<DocumentationHub />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/disease-detection-advanced" element={<ProtectedRoute><DiseaseDetectionAdvanced /></ProtectedRoute>} />
            <Route path="/pest-risk-heatmap" element={<ProtectedRoute><PestRiskHeatmap /></ProtectedRoute>} />
            <Route path="/voice-assistant" element={<ProtectedRoute><VoiceAssistant /></ProtectedRoute>} />
            <Route path="/ar-field-overlay" element={<ProtectedRoute><ARFieldOverlay /></ProtectedRoute>} />
            <Route path="/digital-twin" element={<ProtectedRoute><DigitalTwinDashboard /></ProtectedRoute>} />
            <Route path="/subsidy-verification" element={<ProtectedRoute><SubsidyVerification /></ProtectedRoute>} />
            <Route path="/subsidy-portal" element={<ProtectedRoute><SubsidyPortal /></ProtectedRoute>} />
            <Route path="/edge-computing" element={<ProtectedRoute><EdgeComputingDashboard /></ProtectedRoute>} />
            
            {/* Analytics Routes */}
            <Route path="/yield-prediction" element={<ProtectedRoute><YieldPredictionAnalytics /></ProtectedRoute>} />
            <Route path="/soil-health-analytics" element={<ProtectedRoute><SoilHealthAnalytics /></ProtectedRoute>} />
            <Route path="/weather-impact" element={<ProtectedRoute><WeatherImpactAnalytics /></ProtectedRoute>} />
            <Route path="/cost-benefit-analysis" element={<ProtectedRoute><CostBenefitAnalysis /></ProtectedRoute>} />
            <Route path="/crop-comparison" element={<ProtectedRoute><CropComparisonAnalytics /></ProtectedRoute>} />
            <Route path="/market-prices" element={<ProtectedRoute><MarketPriceIntegration /></ProtectedRoute>} />
            <Route path="/water-optimization" element={<ProtectedRoute><WaterUsageOptimization /></ProtectedRoute>} />
            
            {/* Futuristic Routes */}
            <Route path="/ai-crop-advisor" element={<ProtectedRoute><AICropAdvisor /></ProtectedRoute>} />
            <Route path="/drone-monitoring" element={<ProtectedRoute><DroneMonitoringSystem /></ProtectedRoute>} />
            <Route path="/iot-sensors" element={<ProtectedRoute><IoTSensorDashboard /></ProtectedRoute>} />
            <Route path="/predictive-weather" element={<ProtectedRoute><PredictiveWeatherAI /></ProtectedRoute>} />
            <Route path="/disease-detector" element={<ProtectedRoute><CropDiseaseAIDetector /></ProtectedRoute>} />
            <Route path="/smart-irrigation" element={<ProtectedRoute><SmartIrrigationSystem /></ProtectedRoute>} />
            <Route path="/blockchain-certification" element={<ProtectedRoute><BlockchainCropCertification /></ProtectedRoute>} />
            <Route path="/pest-management" element={<ProtectedRoute><AIPestManagement /></ProtectedRoute>} />
            <Route path="/satellite-imagery" element={<ProtectedRoute><SatelliteImageryAnalysis /></ProtectedRoute>} />
            <Route path="/climate-risk" element={<ProtectedRoute><ClimateRiskAssessment /></ProtectedRoute>} />
            <Route path="/precision-farming" element={<ProtectedRoute><PrecisionFarmingDashboard /></ProtectedRoute>} />
            <Route path="/yield-forecasting" element={<ProtectedRoute><CropYieldForecastingAI /></ProtectedRoute>} />
            <Route path="/soil-microbiome" element={<ProtectedRoute><SoilMicrobiomeAnalysis /></ProtectedRoute>} />
            <Route path="/carbon-footprint" element={<ProtectedRoute><CarbonFootprintTracker /></ProtectedRoute>} />
            <Route path="/community-hub" element={<ProtectedRoute><FarmerCommunityHub /></ProtectedRoute>} />

            {/* System Management Routes */}
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><HelpAndSupportPage /></ProtectedRoute>} />
            <Route path="/data-management" element={<ProtectedRoute><DataManagementPage /></ProtectedRoute>} />
            <Route path="/integrations" element={<ProtectedRoute><IntegrationPage /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/regional-monitoring" element={<ProtectedRoute requireAdmin={true}><RegionalMonitoringDashboard /></ProtectedRoute>} />
            <Route path="/audit-dashboard" element={<ProtectedRoute requireAdmin={true}><AuditDashboard /></ProtectedRoute>} />
            <Route path="/model-drift-detection" element={<ProtectedRoute requireAdmin={true}><ModelDriftDetection /></ProtectedRoute>} />
            <Route path="/subsidy-admin" element={<ProtectedRoute requireAdmin={true}><SubsidyAdmin /></ProtectedRoute>} />
            <Route path="/farmer-performance" element={<ProtectedRoute requireAdmin={true}><FarmerPerformanceMetrics /></ProtectedRoute>} />

            <Route path="*" element={
              <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                  <p className="text-xl text-gray-400 mb-8">Page not found</p>
                  <a href="/" className="text-[#00d4ff] hover:underline">Back to home</a>
                </div>
              </div>
            } />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      {isPublicPage && <Footer />}
    </>
  );
};

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <AccessibilityProvider>
          <HelpProvider>
            <TutorialProvider>
              <Router>
                <ScrollToTop />
                <AppContent />
                <Toaster />
              </Router>
            </TutorialProvider>
          </HelpProvider>
        </AccessibilityProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;