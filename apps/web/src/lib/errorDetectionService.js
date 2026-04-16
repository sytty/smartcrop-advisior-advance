class ErrorDetectionService {
  constructor() {
    this.errors = [];
    this.listeners = [];
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'runtime',
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack,
        timestamp: new Date().toISOString()
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        error: event.reason?.stack || event.reason,
        timestamp: new Date().toISOString()
      });
    });

    // Intercept console.error
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.logError({
        type: 'console',
        message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '),
        timestamp: new Date().toISOString()
      });
      originalConsoleError.apply(console, args);
    };

    this.isInitialized = true;
  }

  logError(error) {
    this.errors.unshift(error);
    if (this.errors.length > 100) this.errors.pop(); // Keep last 100
    this.notifyListeners();
    
    // Persist to localStorage for cross-session debugging
    try {
      localStorage.setItem('app_errors', JSON.stringify(this.errors.slice(0, 20)));
    } catch (e) { /* ignore quota errors */ }
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
    localStorage.removeItem('app_errors');
    this.notifyListeners();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.errors));
  }
}

export const errorService = new ErrorDetectionService();