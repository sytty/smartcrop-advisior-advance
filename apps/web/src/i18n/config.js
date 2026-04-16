import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './translations/en.json';
import es from './translations/es.json';
import hi from './translations/hi.json';
import pt from './translations/pt.json';
import sw from './translations/sw.json';
import mr from './translations/mr.json';
import fr from './translations/fr.json';
import de from './translations/de.json';
import it from './translations/it.json';
import ja from './translations/ja.json';
import zh from './translations/zh.json';
import ko from './translations/ko.json';
import ru from './translations/ru.json';
import ar from './translations/ar.json';
import tr from './translations/tr.json';
import vi from './translations/vi.json';

const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      hi: { translation: hi },
      pt: { translation: pt },
      sw: { translation: sw },
      mr: { translation: mr },
      fr: { translation: fr },
      de: { translation: de },
      it: { translation: it },
      ja: { translation: ja },
      zh: { translation: zh },
      ko: { translation: ko },
      ru: { translation: ru },
      ar: { translation: ar },
      tr: { translation: tr },
      vi: { translation: vi }
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;