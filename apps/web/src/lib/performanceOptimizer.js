export const performanceOptimizer = {
  metrics: {
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    ttfb: null
  },
  
  observers: [],

  init() {
    if (!window.PerformanceObserver) return;

    try {
      // Paint Timing (FCP)
      const paintObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
          }
        }
      });
      paintObserver.observe({ type: 'paint', buffered: true });
      this.observers.push(paintObserver);

      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(lcpObserver);

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cls = clsValue;
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(clsObserver);

    } catch (e) {
      console.warn('PerformanceObserver not fully supported', e);
    }
  },

  getMetrics() {
    return {
      ...this.metrics,
      memory: performance.memory ? {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      } : null,
      navigation: performance.getEntriesByType('navigation')[0] || null
    };
  },

  disconnect() {
    this.observers.forEach(obs => obs.disconnect());
  }
};