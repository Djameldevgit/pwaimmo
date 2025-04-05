import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/actions/authAction'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import Avatar from '../Avatar'
import NotifyModal from '../NotifyModal'
import LanguageSelector from '../LanguageSelector'
import Modalsearchhome from '../Modalsearchhome'
//import { useTranslation } from 'react-i18next'

const Menu = () => {
    const [filters, setFilters] = useState({ title: '' });


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

     

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const navLinks = [
        { label: 'Home', icon: 'home', path: '/' },
        { label: 'Search', icon: 'search', path: '#' },
        { label: 'Discover', icon: 'explore', path: '/discover' }
    ]

    const { auth, theme, notify } = useSelector(state => state)
    const dispatch = useDispatch()
    const { pathname } = useLocation()

    const isActive = (pn) => {
        if (pn === pathname) return 'active'
    }

    return (
        <div className="menu">


            <ul className="navbar-nav flex-row">
                {navLinks.map((link, index) => (
                    <li className={`nav-item px-2 ${isActive(link.path)}`} key={index}>
                        <Link
                            className="nav-link"
                            to={link.path}
                            onClick={() => {
                                if (link.label === "Search") {
                                    openModal(); // Abre el modal solo si es el ícono de búsqueda
                                }
                            }}
                        >
                            <span className="material-icons">{link.icon}</span>
                        </Link>
                    </li>
                ))}
                <Modalsearchhome isOpen={isModalOpen} onClose={closeModal}>
                    <div>
                        <h3>Search by title and province</h3>
                        <div className="filter-group">
                            <small>Titre</small>
                            <input
                                type="text"
                                name="title"
                                placeholder="Titre"
                                onChange={handleFilterChange}
                                value={filters.title}
                            />


                        </div>
                        <button onClick={closeModal}>Cerrar</button>
                    </div>
                </Modalsearchhome>
                {/* Icono de notificaciones */}
                <li className="nav-item dropdown" style={{ opacity: 1 }}>
                    <span className="nav-link position-relative" id="navbarDropdown"
                        role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="material-icons"
                            style={{ color: notify.data.length > 0 ? 'crimson' : '' }}>
                            favorite
                        </span>
                        <span className="notify_length">{notify.data.length}</span>
                    </span>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown"
                        style={{ transform: 'translateX(75px)' }}>
                        <NotifyModal />
                    </div>
                </li>

                {/* Menú para usuarios autenticados */}
                {auth.user ? (
                    <li className="nav-item dropdown" style={{ opacity: 1 }}>
                        <span className="nav-link dropdown-toggle" id="navbarDropdown"
                            role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <Avatar src={auth.user.avatar} size="medium-avatar" />
                        </span>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <div className='language'>
                                <LanguageSelector />
                            </div>
                            <Link className="dropdown-item" onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true })}>
                                Ajouter un annnoces
                            </Link>

                            {/* Opciones para administradores */}
                            {auth.user.role === "admin" && (
                                <>
                                    <Link className="dropdown-item" to='/administration/users/reportuser'>Reports user </Link>

                                    <Link className="dropdown-item" to='/administration/homepostspendientes'>Posts pendientes</Link>
                                    <Link className="dropdown-item" to='/administration/roles'>Roles</Link>
                                    <Link className="dropdown-item" to='/administration/usersaction'>Usuarios acción</Link>
                                    <Link className="dropdown-item" to='/administration/usersedicion'>Edición de usuarios</Link>
                                    <Link className="dropdown-item" to='/administration/listadeusuariosbloqueadoss'>Usuarios bloqueados</Link>
                                </>
                            )}

                            {/* Enlace al perfil */}
                            <Link className="dropdown-item" to={`/profile/${auth.user._id}`}>Profile</Link>

                            {/* Cambiar tema */}
                            <label htmlFor="theme" className="dropdown-item"
                                onClick={() => dispatch({ type: GLOBALTYPES.THEME, payload: !theme })}>
                                {theme ? 'Light mode' : 'Dark mode'}
                            </label>

                            {/* Logout */}
                            <div className="dropdown-divider"></div>
                            <Link className="dropdown-item" to="/" onClick={() => dispatch(logout())}>
                                Logout
                            </Link>
                        </div>
                    </li>
                ) : (
                    // Menú para usuarios no autenticados
                    <div className="btn-group user-icon-container">
                        <i className="fas fa-user user-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                        <div className="dropdown-menu  ">

                            <Link className="dropdown-item" to='/login'>Se conecter</Link>
                            <div className="dropdown-divider"></div>
                            <Link className="dropdown-item" to='/register'>Sinscrire</Link>
                        </div>
                    </div>
                )}
            </ul>
        </div>
    )
}

export default Menu