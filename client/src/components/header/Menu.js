import React, { useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import Avatar from '../Avatar';
import NotifyModal from '../NotifyModal';
import LanguageSelector from '../LanguageSelector';
import Modalsearchhome from '../Modalsearchhome';
import AuthModalAddLikesCommentsSave from '../AuthModalAddLikesCommentsSave';
//import { subscribeToPushNotifications } from '../../redux/actions/notifyAction';

const Menu = () => {
    const dispatch = useDispatch();
    const { auth, theme, notify } = useSelector(state => state); // Obtén el estado de autenticación, tema y notificaciones
    const history = useHistory(); // Para redireccionar al usuario
    const { pathname } = useLocation(); // Para verificar la ruta actual

    const [filters, setFilters] = useState({ title: '' });
    const [isModalOpen, setIsModalOpen] = useState(false); // Para el modal de búsqueda
    const [showAuthModal, setShowAuthModal] = useState(false); // Para el modal de autenticación

    const handleSubscribe = () => {
        dispatch(subscribeToPushNotifications({ auth }));
    };

    // Definir las funciones antes de usarlas
    const openSearchModal = () => {
        setIsModalOpen(true);
    };

    const handleDiscoverClick = () => {
        if (auth.user) {
            // Si el usuario está autenticado, ejecuta el dispatch
            dispatch({ type: GLOBALTYPES.STATUS, payload: true });
        } else {
            // Si no está autenticado, muestra el modal
            setShowAuthModal(true);
        }
    };

    const navLinks = [
        { label: 'Home', icon: 'home', path: '/' }, // Sin función onClick
        { label: 'Search', icon: 'search', path: '#', onClick: openSearchModal }, // Función para abrir el modal de búsqueda
        { label: 'Discover', icon: 'fas fa-plus', onClick: handleDiscoverClick } // Función para ejecutar el dispatch
    ];

    const isActive = (pn) => {
        if (pn === pathname) return 'active';
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const redirectToLogin = () => {
        history.push('/login'); // Redirige al usuario a la página de inicio de sesión
        setShowAuthModal(false); // Cierra el modal
    };

    const redirectToRegister = () => {
        history.push('/register'); // Redirige al usuario a la página de registro
        setShowAuthModal(false); // Cierra el modal
    };

    const closeSearchModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="menu">
            <ul className="navbar-nav flex-row">
                {navLinks.map((link, index) => (
                    <li className={`nav-item px-2 ${isActive(link.path)}`} key={index}>
                        <Link
                            className="nav-link"
                            to={link.path || '#'}
                            onClick={(e) => {
                                // Solo prevenir la navegación si hay una función onClick
                                if (link.onClick) {
                                    e.preventDefault();
                                    link.onClick();
                                }
                            }}
                        >
                            {link.icon.startsWith('fa') ? (
                                <i className={link.icon}></i>
                            ) : (
                                <span className="material-icons">{link.icon}</span>
                            )}
                        </Link>
                    </li>
                ))}

                {/* Modal para usuarios no autenticados */}
                <AuthModalAddLikesCommentsSave
                    showModal={showAuthModal}
                    closeModal={() => setShowAuthModal(false)}
                    redirectToLogin={redirectToLogin}
                    redirectToRegister={redirectToRegister}
                />

                {/* Modal de búsqueda */}
                <Modalsearchhome isOpen={isModalOpen} onClose={closeSearchModal}>
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
                        <button onClick={closeSearchModal}>Cerrar</button>
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

                            <div className="dropdown-item" onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true })}>
                                Ajouter un annnoces
                            </div>
                            <Link className="dropdown-item" to='/informacionaplicacion'>Info aplication</Link>
                            <Link className="dropdown-item" to='/message'>Chat </Link>
                         
                           
                            {auth.user.role === "admin" && (
                                <> 
                                 <Link className="dropdown-item" to='/administration/estadoactividaduser'>Estado actividad user </Link>
                                  <Link className="dropdown-item" to='/administration/harramientas'>Haramientas </Link>
                            
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
                            

                            {/* Logout */}
                            <div className="dropdown-divider"></div>
                            <Link className="dropdown-item" to="/" onClick={() => dispatch(logout())}>
                                Desconexion
                            </Link>
                        </div>
                    </li>
                ) : (
                    // Menú para usuarios no autenticados
                    <div className="btn-group user-icon-container">
                        <i className="fas fa-user user-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                        <div className="dropdown-menu">
                            <Link className="dropdown-item" to='/informacionaplicacion'>Info aplicacion</Link>
                            <Link className="dropdown-item" to='/login'>Se connecter</Link>
                            <div className="dropdown-divider"></div>
                            <Link className="dropdown-item" to='/register'>S'inscrire</Link>
                        </div>
                    </div>
                )}
            </ul>
        </div>
    );
};

export default Menu;