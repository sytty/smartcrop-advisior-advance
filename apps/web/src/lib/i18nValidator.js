import i18n from '../i18n/config';

export const i18nValidator = {
  validate() {
    const languages = ['en', 'es', 'hi', 'pt', 'sw', 'mr', 'fr', 'de', 'it', 'ja', 'zh', 'ko', 'ru', 'ar', 'tr', 'vi'];
    const requiredNamespaces = ['common', 'nav', 'auth', 'dashboard', 'footer', 'analytics', 'monitoring', 'intelligence', 'admin', 'enterprise', 'futuristic'];
    
    const report = {
      totalLanguages: languages.length,
      loadedLanguages: 0,
      missingNamespaces: [],
      rtlSupport: { ar: false },
      status: 'healthy'
    };

    languages.forEach(lang => {
      const data = i18n.store.data[lang]?.translation;
      if (data) {
        report.loadedLanguages++;
        
        requiredNamespaces.forEach(ns => {
          if (!data[ns]) {
            report.missingNamespaces.push({ language: lang, namespace: ns });
          }
        });
      }
    });

    // Check RTL
    if (i18n.store.data['ar']) {
      report.rtlSupport.ar = true;
    }

    if (report.missingNamespaces.length > 0 || report.loadedLanguages < languages.length) {
      report.status = 'warning';
    }

    return report;
  }
};