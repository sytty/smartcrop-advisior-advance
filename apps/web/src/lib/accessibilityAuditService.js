export const accessibilityAuditService = {
  runAudit() {
    const issues = [];
    let score = 100;

    // 1. Check Images for Alt text
    const images = document.querySelectorAll('img');
    let missingAlt = 0;
    images.forEach(img => {
      if (!img.hasAttribute('alt')) missingAlt++;
    });
    if (missingAlt > 0) {
      issues.push({ severity: 'medium', type: 'Missing Alt Text', message: `${missingAlt} images are missing alt attributes` });
      score -= (missingAlt * 2);
    }

    // 2. Check Form Inputs for Labels
    const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"])');
    let missingLabels = 0;
    inputs.forEach(input => {
      const id = input.id;
      const hasLabel = id ? document.querySelector(`label[for="${id}"]`) : false;
      const hasAria = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');
      if (!hasLabel && !hasAria) missingLabels++;
    });
    if (missingLabels > 0) {
      issues.push({ severity: 'high', type: 'Missing Form Labels', message: `${missingLabels} inputs lack associated labels or ARIA labels` });
      score -= (missingLabels * 5);
    }

    // 3. Check Heading Hierarchy
    const h1s = document.querySelectorAll('h1');
    if (h1s.length === 0) {
      issues.push({ severity: 'medium', type: 'Heading Structure', message: 'Page is missing an H1 heading' });
      score -= 10;
    } else if (h1s.length > 1) {
      issues.push({ severity: 'low', type: 'Heading Structure', message: 'Page has multiple H1 headings (HTML5 allows this, but often discouraged)' });
      score -= 5;
    }

    return {
      score: Math.max(0, score),
      timestamp: new Date().toISOString(),
      issues,
      elementsChecked: images.length + inputs.length + document.querySelectorAll('button, a').length
    };
  }
};