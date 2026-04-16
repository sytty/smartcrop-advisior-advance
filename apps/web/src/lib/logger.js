/**
 * Simple singleton logger utility for consistent console logging
 */
export const logger = {
  info: (message, data) => {
    if (data !== undefined) {
      console.info(`[INFO] ${message}`, data);
    } else {
      console.info(`[INFO] ${message}`);
    }
  },
  
  error: (message, error) => {
    if (error !== undefined) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      console.error(`[ERROR] ${message}`);
    }
  },
  
  warn: (message, data) => {
    if (data !== undefined) {
      console.warn(`[WARN] ${message}`, data);
    } else {
      console.warn(`[WARN] ${message}`);
    }
  },
  
  debug: (message, data) => {
    if (data !== undefined) {
      console.debug(`[DEBUG] ${message}`, data);
    } else {
      console.debug(`[DEBUG] ${message}`);
    }
  }
};

export default logger;