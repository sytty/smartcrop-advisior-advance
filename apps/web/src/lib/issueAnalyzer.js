export const issueAnalyzer = {
  analyze() {
    return {
      summary: { critical: 0, high: 1, medium: 3, low: 5 },
      issues: [
        { id: 'ISS-001', title: 'Missing ARIA label on Language Selector', severity: 'medium', status: 'new', component: 'LanguageSelector.jsx', rootCause: 'Omission during development', impact: 'Screen reader users cannot identify the button purpose.' },
        { id: 'ISS-002', title: 'Unused CSS classes in Dashboard', severity: 'low', status: 'in-progress', component: 'DashboardPage.jsx', rootCause: 'Refactoring leftovers', impact: 'Slightly increased bundle size.' },
        { id: 'ISS-003', title: 'API Rate Limit Warning', severity: 'high', status: 'new', component: 'apiServerClient.js', rootCause: 'Aggressive polling in Digital Twin', impact: 'Potential IP ban if traffic spikes.' },
        { id: 'ISS-004', title: 'Sub-optimal image loading', severity: 'medium', status: 'fixed', component: 'FeatureCard.jsx', rootCause: 'Missing loading="lazy" attribute', impact: 'Slower initial page load.' }
      ]
    };
  }
};