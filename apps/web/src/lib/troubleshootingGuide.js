export const troubleshootingGuide = {
  generate() {
    return {
      commonIssues: [
        { issue: 'Data not syncing offline', solution: 'Check IndexedDB quota and ensure service worker is registered.' },
        { issue: 'Voice Assistant not listening', solution: 'Ensure microphone permissions are granted in browser settings.' },
        { issue: 'AR Overlay not rendering', solution: 'Requires WebGL support and camera permissions.' }
      ],
      errorCodes: [
        { code: 'AUTH_001', meaning: 'Invalid credentials', action: 'Reset password or check email.' },
        { code: 'NET_005', meaning: 'API Timeout', action: 'Check connection, retry request.' }
      ],
      faqs: [
        { q: 'How do I change language?', a: 'Use the globe icon in the top right header.' },
        { q: 'Is my data secure?', a: 'Yes, all data is encrypted at rest and in transit.' }
      ]
    };
  }
};