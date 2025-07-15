import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
  };

  return (
    <button className="text-black flex items-center gap-2 mx-2" onClick={toggleLanguage}>
      <span>{i18n.language === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
      <span>{i18n.language === 'vi' ? 'VI' : 'EN'}</span>
    </button>
  );
}
