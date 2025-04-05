import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { login } from '../redux/actions/authAction';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { languageReducer } = useSelector(state => state);
    const { t } = useTranslation();

    const initialState = { email: '', password: '' };
    const [userData, setUserData] = useState(initialState);
    const { email, password } = userData;

    const [typePass, setTypePass] = useState(false);

    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (auth.token) history.push('/');
    }, [auth.token, history]);

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(userData));
    };

    return (
        <div className="auth_page">
            <form onSubmit={handleSubmit}>
                <h3 className="text-uppercase text-center mb-4">
             {t('realestate', { lng: languageReducer.language })}
                </h3>

                {/* 📧 Input de Email */}
                <div className="form-group">
                    <label htmlFor="email">{t('email', { lng: languageReducer.language })}</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        aria-describedby="emailHelp"
                        onChange={handleChangeInput}
                        value={email}
                        autoComplete="username" // Agregado aquí
                    />
                    <small id="emailHelp" className="form-text text-muted">
                        {t('email_help', { lng: languageReducer.language })}
                    </small>
                </div>

                {/* 🔒 Input de Contraseña */}
                <div className="form-group">
                    <label htmlFor="password">{t('password', { lng: languageReducer.language })}</label>
                    <div className="pass">
                        <input
                            type={typePass ? 'text' : 'password'}
                            className="form-control"
                            id="password"
                            name="password"
                            onChange={handleChangeInput}
                            value={password}
                            autoComplete="current-password" // Agregado aquí
                        />
                        <small onClick={() => setTypePass(!typePass)}>
                            {typePass ? t('hide', { lng: languageReducer.language }) : t('show', { lng: languageReducer.language })}
                        </small>
                    </div>
                </div>

                {/* 🔘 Botón de Login */}
                <button type="submit" className="btn btn-dark w-100" disabled={!email || !password}>
                    {t('login', { lng: languageReducer.language })}
                </button>

                {/* 📝 Link para Registro */}
                <p className="my-2">
                    {t('no_account', { lng: languageReducer.language })}{' '}
                    <Link to="/register" style={{ color: 'crimson' }}>
                        {t('register_now', { lng: languageReducer.language })}
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;