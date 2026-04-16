export const securityAuditService = {
  runAudit() {
    const issues = [];
    let score = 100;

    // 1. Check HTTPS
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      issues.push({ severity: 'high', type: 'Transport Security', message: 'Application is not running over HTTPS' });
      score -= 30;
    }

    // 2. Check LocalStorage for sensitive data (heuristic)
    const lsKeys = Object.keys(localStorage);
    if (lsKeys.some(k => k.toLowerCase().includes('password') || k.toLowerCase().includes('secret'))) {
      issues.push({ severity: 'high', type: 'Data Storage', message: 'Potentially sensitive data found in plain text in localStorage' });
      score -= 20;
    }

    // 3. Check PocketBase Auth Token
    const pbAuth = localStorage.getItem('pocketbase_auth');
    if (pbAuth) {
      try {
        const parsed = JSON.parse(pbAuth);
        if (parsed.token && parsed.token.split('.').length !== 3) {
          issues.push({ severity: 'medium', type: 'Authentication', message: 'Auth token format appears invalid or insecure' });
          score -= 10;
        }
      } catch (e) {
        // ignore
      }
    }

    return {
      score: Math.max(0, score),
      timestamp: new Date().toISOString(),
      issues,
      status: score >= 90 ? 'secure' : score >= 70 ? 'warning' : 'critical'
    };
  }
};