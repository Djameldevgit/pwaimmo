import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import * as languageActions from '../redux/actions/languageAction';
 
function LanguageSelector() {
  const dispatch = useDispatch();
  const { auth, languageReducer } = useSelector(state => state);
  const { t } = useTranslation();
  const [cookies, setCookie] = useCookies(['language']);

  const handleLanguageChange = useCallback((language) => {
    if (!auth || !auth.token) {
   
      return;
    }
  
    switch (language) {
      case 'en':
        dispatch(languageActions.inglishLanguage(language, auth));
        break;
      case 'fr':
        dispatch(languageActions.franchLanguage(language, auth));
        break;
      case 'ar':
        dispatch(languageActions.arabLanguage(language, auth));
        break;
      default:
        dispatch(languageActions.synchronizeLanguage(language, auth));
        break;
    }
  
    setCookie('language', language, { path: '/' });
  }, [auth, dispatch, setCookie]);
  

  useEffect(() => {
    const defaultLanguage = cookies.language || 'fr';
    handleLanguageChange(defaultLanguage);
  }, [cookies.language, handleLanguageChange]);

  return (
    <div className='language-button' style={{display:'flex'}}>
    <button className="dropdown-item" onClick={() => handleLanguageChange('ar')}>
  {t('AR', { lng: languageReducer.language })}
</button>
<button className="dropdown-item" onClick={() => handleLanguageChange('fr')}>
  {t('FR', { lng: languageReducer.language })}
</button>
<button className="dropdown-item" onClick={() => handleLanguageChange('en')}>
  {t('EN', { lng: languageReducer.language })}
</button>

  </div>
  
  );
}

export default LanguageSelector;
