import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'src/redux/hook';
import { fetchGetUserSetting, fetchPostUserSetting } from 'src/redux/reducers/user';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  // Get data from Redux store
  const { data, loading, error } = useAppSelector((state) => state.users.userSetting);

  // Fetch user setting on component mount
  useEffect(() => {
    dispatch(fetchGetUserSetting());
  }, [dispatch]);

  // Sync i18n language with Redux store
  useEffect(() => {
    // Check if data exists and has language property
    if (data && data.language && i18n.language !== data.language) {
      i18n.changeLanguage(data.language);
    }
  }, [data, i18n]);

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'vi' ? 'en' : 'vi';

    try {
      // Update language in backend using fetchPostUserSetting
      await dispatch(fetchPostUserSetting({ language: newLang })).unwrap();

      // Update i18n language
      i18n.changeLanguage(newLang);
    } catch (error) {
      console.error('Failed to update language:', error);
    }
  };

  if (loading) {
    return (
      <button className="text-black flex items-center gap-2 mx-2" disabled>
        <span>⏳</span>
      </button>
    );
  }

  return (
    <button className="text-black flex items-center gap-2 mx-2" onClick={toggleLanguage} disabled={loading}>
      <span>{i18n.language === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
      <span>{i18n.language === 'vi' ? 'VI' : 'EN'}</span>
    </button>
  );
}
