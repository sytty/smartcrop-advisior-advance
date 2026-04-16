export const responsiveDesignTester = {
  runTest() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    let breakpoint = 'desktop';
    if (width < 768) breakpoint = 'mobile';
    else if (width < 1024) breakpoint = 'tablet';

    return {
      viewport: { width, height },
      breakpoint,
      isTouchDevice: isTouch,
      pixelRatio: window.devicePixelRatio,
      orientation: width > height ? 'landscape' : 'portrait',
      userAgent: navigator.userAgent
    };
  }
};