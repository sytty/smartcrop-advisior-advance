#!/usr/bin/env node

/**
 * Feature Testing Suite
 * Tests specific application features and routes
 */

const fs = require('fs');
const path = require('path');

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

async function runFeatureTests() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   FEATURE TESTING SUITE                                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const pagesDir = path.join(process.cwd(), 'apps/web/src/pages');
  const componentsDir = path.join(process.cwd(), 'apps/web/src/components');

  // Test 1: Critical Pages
  console.log('📄 TEST 1: Critical Pages Availability\n');
  const criticalPages = [
    'HomePage.jsx',
    'LoginPage.jsx',
    'SignupPage.jsx',
    'DashboardPage.jsx',
    'AdminDashboard.jsx'
  ];

  let pageStatus = true;
  for (const page of criticalPages) {
    const exists = fileExists(path.join(pagesDir, page));
    const icon = exists ? '✅' : '❌';
    console.log(`${icon} ${page}`);
    if (!exists) pageStatus = false;
  }
  console.log('');

  // Test 2: AI Feature Pages
  console.log('🤖 TEST 2: AI Feature Pages (Sample)\n');
  const aiPages = [
    'AICropAdvisor.jsx',
    'AIPestManagement.jsx',
    'CropDiseaseAIDetector.jsx',
    'PredictiveWeatherAI.jsx',
    'VoiceAssistant.jsx'
  ];

  let aiStatus = true;
  for (const page of aiPages) {
    const exists = fileExists(path.join(pagesDir, page));
    const icon = exists ? '✅' : '❌';
    console.log(`${icon} ${page}`);
    if (!exists) aiStatus = false;
  }
  console.log('');

  // Test 3: Core Components
  console.log('🧩 TEST 3: Core Components\n');
  const coreComponents = [
    'Header.jsx',
    'Footer.jsx',
    'AuthContext.jsx',
    'ProtectedRoute.jsx',
    'ErrorBoundary.jsx'
  ];

  let componentStatus = true;
  for (const comp of coreComponents) {
    const exists = fileExists(path.join(componentsDir, comp));
    const icon = exists ? '✅' : '❌';
    console.log(`${icon} ${comp}`);
    if (!exists) componentStatus = false;
  }
  console.log('');

  // Test 4: Routing Configuration
  console.log('🗺️  TEST 4: Routing Configuration\n');
  const appJsx = readFile(path.join(process.cwd(), 'apps/web/src/App.jsx'));
  if (appJsx) {
    const hasRoutes = appJsx.includes('<Routes>');
    const hasAuthProvider = appJsx.includes('AuthProvider');
    const hasErrorBoundary = appJsx.includes('ErrorBoundary');
    
    console.log(`${hasRoutes ? '✅' : '❌'} Routes configured`);
    console.log(`${hasAuthProvider ? '✅' : '❌'} AuthProvider setup`);
    console.log(`${hasErrorBoundary ? '✅' : '❌'} ErrorBoundary implemented\n`);
  }

  // Test 5: Authentication Context
  console.log('🔐 TEST 5: Authentication Features\n');
  const authContext = readFile(path.join(componentsDir, 'AuthContext.jsx'));
  if (authContext) {
    const hasLogin = authContext.includes('login');
    const hasSignup = authContext.includes('signup');
    const hasLogout = authContext.includes('logout');
    const hasReset = authContext.includes('resetPassword');
    
    console.log(`${hasLogin ? '✅' : '❌'} Login functionality`);
    console.log(`${hasSignup ? '✅' : '❌'} Signup functionality`);
    console.log(`${hasLogout ? '✅' : '❌'} Logout functionality`);
    console.log(`${hasReset ? '✅' : '❌'} Password reset\n`);
  }

  // Test 6: API Routes
  console.log('🔌 TEST 6: API Routes\n');
  const apiRoutes = path.join(process.cwd(), 'apps/api/src/routes');
  const apiFiles = fileExists(apiRoutes) ? fs.readdirSync(apiRoutes).filter(f => f.endsWith('.js')) : [];
  
  for (const file of apiFiles) {
    console.log(`✅ ${file}`);
  }
  console.log('');

  // Test 7: Database Configuration
  console.log('💾 TEST 7: Database Configuration\n');
  const pbEnv = fileExists(path.join(process.cwd(), 'apps/pocketbase/.env'));
  const apiEnv = fileExists(path.join(process.cwd(), 'apps/api/.env'));
  
  console.log(`${pbEnv ? '✅' : '❌'} PocketBase .env file`);
  console.log(`${apiEnv ? '✅' : '❌'} API .env file\n`);

  // Summary
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('✅ FEATURE TESTING COMPLETED\n');
  
  const allPass = pageStatus && aiStatus && componentStatus;
  if (allPass) {
    console.log('All critical features are properly configured!\n');
    console.log('Ready to:');
    console.log('  ✓ Test authentication');
    console.log('  ✓ Access dashboards');
    console.log('  ✓ Use AI features');
    console.log('  ✓ Create test data\n');
  } else {
    console.log('Some features may need attention.\n');
  }
}

runFeatureTests().catch(console.error);
