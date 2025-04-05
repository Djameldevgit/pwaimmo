import React from 'react';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation();
  
  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg justify-content-between align-middle">
        <Link to="/" className="logo">
          <h1 className="navbar-brand text-uppercase p-0 mt-2 ml-5" onClick={() => {
            window.scrollTo({ top: 0 }); // Desplaza la página al inicio
          }}>
            {t('realestate', { lng: languageReducer.language })}
          </h1>
          <img src='icon-web-01.png' className='imagelogo' alt="imagelogo" />
        </Link>

        <Menu />
      </nav>
    </div>
  );
};

export default Header;