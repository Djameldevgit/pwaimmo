import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'
const InformationUserPost = ({ post }) => {
    const { auth } = useSelector(state => state);
    const { languageReducer } = useSelector(state => state)
    const { t } = useTranslation()
    const [visibility, setVisibility] = useState({
        showNormalName: false,
        showNormalEmail: false,
        showNormalPhone: false
    });

    const canToggleName = (auth.user._id === post.user._id || auth.user.role === 'admin');
    const canToggleEmail = (auth.user._id === post.user._id || auth.user.role === 'admin');
    const canTogglePhone = (auth.user._id === post.user._id || auth.user.role === 'admin');

    // Obtén el estado de visibilidad desde el localStorage
    useEffect(() => {
        const savedVisibility = localStorage.getItem(`postVisibility-${post._id}`);
        if (savedVisibility !== null) {
            setVisibility(JSON.parse(savedVisibility));
        }
    }, [post._id]);

    // Actualiza el estado de visibilidad en el localStorage
    useEffect(() => {
        localStorage.setItem(`postVisibility-${post._id}`, JSON.stringify(visibility));
    }, [post._id, visibility]);

    // Funciones para manejar la visibilidad
    const handleToggle = (field) => {
        setVisibility(prevVisibility => ({
            ...prevVisibility,
            [field]: !prevVisibility[field]
        }));
    };

    const getVisibilityStyle = (field) => {
        return visibility[field] ? {} : { filter: 'blur(5px)' };
    };

    return (
        <div
            className="info-contact-container">
            <div className="info-contact-card" >
                <h3 className="info-contact-title" style={{
                    display: 'flex',
                    justifyContent: languageReducer.language === 'ar' ? 'right' : 'flex-start', // Alinea a la derecha si es árabe
                    flexDirection: 'row', // Para alinear los hijos verticalmente
                }}>
                     {t('contact', { lng: languageReducer.language })}
                </h3>

                <div className="info-contact-item" style={{
                    display: 'flex',
                    justifyContent: languageReducer.language === 'ar' ? 'right' : 'flex-start', // Alinea a la derecha si es árabe
                    flexDirection: 'row', // Para alinear los hijos verticalmente
                }}>
                    <i className="fas fa-user"></i>
                    <p style={getVisibilityStyle('showNormalName')}>{post.user.username}</p>
                    {canToggleName && (
                        <button onClick={() => handleToggle('showNormalName')} className="toggle-button">
                            {visibility.showNormalName ? t('hide', { lng: languageReducer.language }) : t('show', { lng: languageReducer.language })}
                        </button>
                    )}
                </div>

                <div className="info-contact-item"  >
                    <i className="fas fa-phone"></i>
                    <p style={getVisibilityStyle('showNormalPhone')}>{post.telefono}</p>
                    {canTogglePhone && (
                        <button onClick={() => handleToggle('showNormalPhone')} className="toggle-button">
                            {visibility.showNormalPhone ? t('hide', { lng: languageReducer.language }) : t('show', { lng: languageReducer.language })}
                        </button>
                    )}
                </div>


                <div className="info-contact-item">
                    <i className="fas fa-envelope"></i>
                    <p style={getVisibilityStyle('showNormalEmail')}>{post.email}</p>
                    {canToggleEmail && (
                        <button onClick={() => handleToggle('showNormalEmail')} className="toggle-button">
                            {visibility.showNormalEmail ? t('hide', { lng: languageReducer.language }) : t('show', { lng: languageReducer.language })}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default InformationUserPost;