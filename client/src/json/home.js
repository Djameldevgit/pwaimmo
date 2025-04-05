import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ChercheAchat from '../components/home/ChercheAchat';
import Location from '../components/home/Location';
import LocationVacances from '../components/home/LocationVacances';
import Vente from '../components/home/Vente';
import ChercheLocation from '../components/home/ChercheLocation';
import Echange from '../components/home/Echange';
import ModalBusquedaAvanzada from '../components/ModalBusquedaAvanzada';
import Header from '../components/header/Header';
import { Link } from 'react-router-dom';

import $ from 'jquery';

import Avatar from '../components/Avatar';

import { logout } from '../redux/actions/authAction';

import { GLOBALTYPES } from '../redux/actions/globalTypes';


let scroll = 0;
const Home = () => {
    const { homePosts, auth } = useSelector(state => state);
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({ subCategory: "", title: "", wilaya: "", commune: "" });
    const [appliedFilters, setAppliedFilters] = useState({ subCategory: "", title: "", wilaya: "", commune: "" });
    const handleOpenModal = () => setShowModal(true); 
    //const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
    //const handleOpenModal = () => setShowModal(true); // Función para abrir el modal
    const handleCloseModal = () => setShowModal(false);
    const handleSearch = () => { setAppliedFilters({ ...filters }); setShowModal(false); };
    const handleResetFilters = () => { setFilters({ subCategory: "", title: "", wilaya: "", commune: "" }); setAppliedFilters({ subCategory: "", title: "", wilaya: "", commune: "" }); };

    const dispatch = useDispatch()
    const avatarSrc = auth?.user?.avatar;
    const username = auth?.user?.username;
    window.addEventListener('scroll', () => {
        if (window.location.pathname === '/') {
            scroll = window.pageYOffset
            return scroll;
        }
    })

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({ top: scroll, behavior: 'smooth' })
        }, 100)
    }, [])
    useEffect(() => {
        // Asignar eventos de clic al abrir y cerrar el sidebar
        const handleSidebarClick = () => {
            $(".page-wrapper").removeClass("toggled");
        };

        $(".sidebar-dropdown > a").click(function () {
            $(".sidebar-submenu").slideUp(200);
            if (
                $(this)
                    .parent()
                    .hasClass("active")
            ) {
                $(".sidebar-dropdown").removeClass("active");
                $(this)
                    .parent()
                    .removeClass("active");
            } else {
                $(".sidebar-dropdown").removeClass("active");
                $(this)
                    .next(".sidebar-submenu")
                    .slideDown(200);
                $(this)
                    .parent()
                    .addClass("active");
            }
        });

        $("#close-sidebar").click(handleSidebarClick);
        $("#close-sidebar2").click(handleSidebarClick);

        $("#show-sidebar").click(function () {
            $(".page-wrapper").addClass("toggled");
        });
        $("#show-sidebar2").click(function () {
            $(".page-wrapper").addClass("toggled");
        });
        // Retorno de la función de efecto para limpiar eventos anteriores
        return () => {
            $("#close-sidebar").off("click", handleSidebarClick);
            $("#close-sidebar2").off("click", handleSidebarClick);
            $("#show-sidebar").off("click");
            $("#show-sidebar2").off("click");
        };
    }, []); // Asegúrate de pasar un array vacío como segundo argumento para que este efecto solo se ejecute una vez





    const userLink = () => {
        return (
            <div className="page-wrapper chiller-theme toggled">
                <a id="show-sidebar2">
                    <i className="fas fa-bars" />
                </a>
                <nav id="sidebar" className="sidebar-wrapper">
                    <div className="sidebar-content">
                        <div className="sidebar-brand">
                            <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                <i className="fas fa-user-cog" style={{ fontSize: '24px', marginRight: '10px' }}></i>
                                <span style={{ fontSize: '16px' }}>Tassili Web</span>
                            </Link>
                            <div id="close-sidebar">
                                <i className="fas fa-times" />
                            </div>
                        </div>
                        <div className="sidebar-header">
                            <div className="user-pic">

                                <img className="img-responsive img-rounded" src="https://as1.ftcdn.net/v2/jpg/03/39/45/96/1000_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg" alt="User picture" />
                            </div>


                            <div className="user-info">
                                <span className="user-name">
                                    <strong>Nom</strong>
                                </span>
                                <span className="user-role">   <strong>Role</strong></span>

                                <span className="user-status">
                                    <i className="fa fa-circle text-danger" />
                                    <span>Ofline</span>
                                </span>
                            </div>
                        </div>




                        <div className="sidebar-menu">
                            <ul>

                                <div className="sidebar-menu">
                                    <ul>
                                        <li className="header-menu">
                                            <span>Compte</span>
                                        </li>
                                        <li className="sidebar-dropdown">
                                            <Link className="dropdown-item" to="/login">
                                                <i className="fa fa-sign-in-alt text-green" />
                                                <span>Se connecter</span>
                                            </Link>
                                        </li>
                                        <li className="sidebar-dropdown">
                                            <Link className="dropdown-item" to="/register">
                                                <i className="fa fa-user-plus text-warning" />
                                                <span>S'inscrire</span>
                                            </Link>
                                        </li>
                                        <li className="header-menu">
                                            <span>Catégories</span>
                                        </li>
                                        <li className="sidebar-dropdown">
                                            <Link className="dropdown-item" to="/pages/salasfiestas">
                                                <i className="fas fa-gem"></i>
                                                <span>Salle des fêtes</span>
                                            </Link>
                                        </li>
                                        <li className="sidebar-dropdown">
                                            <Link className="dropdown-item" to="/pages/cervicios">
                                                <i className="fas fa-tools"></i>
                                                <span>Services</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>











                            </ul>
                        </div>


                    </div>
                </nav>

                <div className="home-container">

                    <Header handleOpenModal={handleOpenModal} />
                    <Vente filters={appliedFilters} />
                    <Location filters={appliedFilters} />
                    <Echange filters={appliedFilters} />
                    <LocationVacances filters={appliedFilters} />
                    <ChercheAchat filters={appliedFilters} />
                    <ChercheLocation filters={appliedFilters} />

                    {/* Modal de búsqueda avanzada */}
                    <ModalBusquedaAvanzada
                        showModal={showModal}
                        handleCloseModal={handleCloseModal}
                        filters={filters}
                        setFilters={setFilters}
                        handleSearch={handleSearch}
                        handleResetFilters={handleResetFilters}
                    />

                    {homePosts.loading && <p>Cargando...</p>}
                </div>






            </div>

        )

    }

    const userauthLink = () => {
        return (
            <div className="page-wrapper chiller-theme toggled">
                <a id="show-sidebar2" className="btn btn-sm btn-dark" href="#">
                    <i className="fas fa-bars" />
                </a>
                <nav id="sidebar" className="sidebar-wrapper">
                    <div className="sidebar-content">
                        <div className="sidebar-brand">
                            <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                <i className="fas fa-user-cog" style={{ fontSize: '24px', marginRight: '10px' }}></i>
                                <span style={{ fontSize: '16px' }}>Tassili Web</span>
                            </Link>
                            <div id="close-sidebar">
                                <i className="fas fa-times" />
                            </div>



                        </div>
                        <div className="sidebar-header">
                            <div className="user-pic">
                                <div className="user-pic" style={{ marginRight: '10px' }}>
                                    {avatarSrc && <Avatar src={avatarSrc} className="img-responsive img-rounded" />}
                                </div>
                            </div>
                            <div className="user-info">
                                <span className="user-name">
                                    {username && <strong>{username}</strong>}
                                </span>
                                <span className="user-role">  {auth.user.role && <strong>{auth.user.role}</strong>}</span>

                                <span className="user-status">
                                    <i className="fa fa-circle" />
                                    <span>Online</span>
                                </span>
                            </div>
                        </div>






                        <div className="sidebar-menu">
                            <ul>
                                <li className="header-menu">
                                    <span>Mon compte</span>
                                </li>

                                <li className="sidebar-dropdown">
                                    <Link className="dropdown-item" to="/pages/administracion/fechadeexpiracionuser">
                                        <i className="fas fa-plus-circle"></i>
                                        <span>fehca expiracion</span>
                                    </Link>
                                </li>

                                <li className="sidebar-dropdown">
                                    <Link className="dropdown-item" to="/pages/categoriaslista/cervices">
                                        <i className="fas fa-plus-circle"></i>
                                        <span>Ajouter Annonce</span>
                                    </Link>
                                </li>
                                <li className="sidebar-dropdown">
                                    <Link className="dropdown-item" to="/pages/notificacionesusuario">
                                        <i className="fas fa-bell"></i>
                                        <span>Notifications</span>
                                        <span className="badge badge-pill badge-danger"> notify</span>
                                    </Link>
                                </li>
                                <li className="sidebar-dropdown">
                                    <Link className="dropdown-item" to={`/profile/${auth.user._id}`}>
                                        <i className="fas fa-user"></i>
                                        <span>Profil</span>
                                    </Link>
                                </li>
                                <li className="sidebar-dropdown">
                                    <Link
                                        className="dropdown-item"
                                        to="/"
                                        onClick={() => dispatch(logout())}
                                    >
                                        <i className="fas fa-power-off" style={{ color: 'red' }}></i>
                                        Se déconnecter
                                    </Link>
                                </li>
                                <li className="header-menu">
                                    <span>Catégories</span>
                                </li>
                                <li className="sidebar-dropdown">
                                    <Link className="dropdown-item" to="/pages/salasfiestas">
                                        <i className="fas fa-gem"></i>
                                        <span>Salle des fêtes</span>
                                    </Link>
                                </li>
                                <li className="sidebar-dropdown">
                                    <Link className="dropdown-item" to="/pages/cervicios">
                                        <i className="fas fa-tools"></i>
                                        <span>Services</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </div>



                </nav>
                <div className="home-container">
                    {/* Pasa handleOpenModal como una prop llamada handleOpenModal */}
                    <Header handleOpenModal={handleOpenModal} />
                    <Vente filters={appliedFilters} />
                    <Location filters={appliedFilters} />
                    <Echange filters={appliedFilters} />
                    <LocationVacances filters={appliedFilters} />
                    <ChercheAchat filters={appliedFilters} />
                    <ChercheLocation filters={appliedFilters} />

                    {/* Modal de búsqueda avanzada */}
                    <ModalBusquedaAvanzada
                        showModal={showModal}
                        handleCloseModal={handleCloseModal}
                        filters={filters}
                        setFilters={setFilters}
                        handleSearch={handleSearch}
                        handleResetFilters={handleResetFilters}
                    />

                    {homePosts.loading && <p>Cargando...</p>}
                </div>
                <div>
                    <div className="page-wrapper chiller-theme toggled">
                        <button id="show-sidebar" className="btn btn-sm btn-dark"  >
                            <i className="fas fa-bars" />
                        </button>

                        <div>



                            <hr></hr>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                                    <li className="breadcrumb-item"><a href="/pages/salasfiestas">Salle des fêtes</a></li>
                                    <li className="breadcrumb-item"><a href="/pages/servicios">Services</a></li>    </ol>
                            </nav>

                            <hr></hr>




                        </div>


                    </div>
                </div>






            </div>
        )
    }

    const adminauthLink = () => {
        return (
            <div className="page-wrapper chiller-theme toggled">
                <a id="show-sidebar2" className="btn btn-sm btn-dark" href="#">
                    <i className="fas fa-bars" />
                </a>
                <nav id="sidebar" className="sidebar-wrapper">
                    <div className="sidebar-content">
                        <div className="sidebar-brand">
                            <Link to="/pages/administracion/index" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                <i className="fas fa-user-cog" style={{ fontSize: '24px', marginRight: '10px' }}></i>
                                <span style={{ fontSize: '16px' }}>Administration</span>
                            </Link>
                            <div id="close-sidebar">
                                <i className="fas fa-times" />
                            </div>
                        </div>
                        <div className="sidebar-header">
                            <div className="user-pic">
                                <div className="user-pic" style={{ marginRight: '10px' }}>
                                    {avatarSrc && <Avatar src={avatarSrc} className="img-responsive img-rounded" />}
                                </div>
                            </div>
                            <div className="user-info">
                                {username && <strong>{username}</strong>}  <span className="user-name">

                                </span>
                                <span className="user-role">  {auth.user.role && <strong>{auth.user.role}</strong>}</span>
                                <span className="user-status">
                                    <i className="fa fa-circle" />
                                    <span>Online</span>
                                </span>
                            </div>
                        </div>



                        <div className="sidebar-menu">
                            <ul>
                                <li className="header-menu">
                                    <span>Administrations</span>
                                </li>
                                <li className="sidebar-dropdown">
                                    <Link className="dropdown-item" to="/pages/categoriaslista/cervices">
                                        <i className="fas fa-plus-circle"></i>
                                        <span>Ajouter Annonce</span>
                                    </Link>
                                </li>
                                <li className="sidebar-dropdown">
                                    <Link className="dropdown-item" to="/pages/administracion/fechadeexpiracionuser">
                                        <i className="fas fa-plus-circle"></i>
                                        <span>fehca expiracion</span>
                                    </Link>
                                </li>

                                <li className="sidebar-dropdown">
                                    <Link className="dropdown-item" to="/pages/administracion/postspendientes">
                                        <i className="fa fa-plus-circle" />
                                        <span>Aprouve salle fetes</span>
                                    </Link>
                                </li>
                                <li className="sidebar-dropdown">
                                    <Link className="dropdown-item" to="/pages/administracion/serviciospendientes">
                                        <i className="fa fa-plus-circle" />
                                        <span>Aprouve services</span>
                                    </Link>
                                </li>
                                <li className="sidebar-dropdown">
                                    <Link className="dropdown-item" to="/pages/users/usersposts">
                                        <i className="fa fa-plus-circle" />
                                        <span>Liste Utilizateurs</span>
                                    </Link>
                                </li>

                                <li className="sidebar-dropdown">
                                    <Link className="dropdown-item" to="/pages/roles/userrole">
                                        <i className="fa fa-plus-circle" />
                                        <span>Liste Roles</span>
                                    </Link>
                                </li>
                                <li className="sidebar-dropdown">
                                    <Link className="dropdown-item" to="/pages/bloqueos/blockposts">
                                        <i className="fa fa-plus-circle" />
                                        <span>Block post</span>
                                    </Link>
                                </li>
                                <li className="sidebar-dropdown">
                                    <Link className="dropdown-item" to="/pages/bloqueos/blockcomments">
                                        <i className="fa fa-plus-circle" />
                                        <span>Block comment</span>
                                    </Link>
                                </li>
                                <li className="sidebar-dropdown">
                                    <Link className="dropdown-item" to={`/pages/profile/${auth.user._id}`}>
                                        <i className="fa fa-user" />
                                        <span>Profil</span>
                                    </Link>
                                </li>




                                <li className="sidebar-dropdown">
                                    <Link
                                        className="dropdown-item"
                                        to="/"
                                        onClick={() => dispatch(logout())}
                                    >
                                        <i className="fas fa-power-off" style={{ color: 'red' }}></i>
                                        Se déconnecter
                                    </Link>
                                </li>
                                <li className="header-menu">
                                    <span>Catégories</span>
                                </li>
                                <li className="sidebar-dropdown">
                                    <Link className="dropdown-item" to="/pages/salasfiestas">
                                        <i className="fas fa-gem"></i>
                                        <span>Salle des fêtes</span>
                                    </Link>
                                </li>
                                <li className="sidebar-dropdown">
                                    <Link className="dropdown-item" to="/pages/cervicios">
                                        <i className="fas fa-tools"></i>
                                        <span>Services</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>


                    </div>



                </nav>
                <div className="home-container">
                    {/* Pasa handleOpenModal como una prop llamada handleOpenModal */}
                    <Header handleOpenModal={handleOpenModal} />
                    <Vente filters={appliedFilters} />
                    <Location filters={appliedFilters} />
                    <Echange filters={appliedFilters} />
                    <LocationVacances filters={appliedFilters} />
                    <ChercheAchat filters={appliedFilters} />
                    <ChercheLocation filters={appliedFilters} />

                    {/* Modal de búsqueda avanzada */}
                    <ModalBusquedaAvanzada
                        showModal={showModal}
                        handleCloseModal={handleCloseModal}
                        filters={filters}
                        setFilters={setFilters}
                        handleSearch={handleSearch}
                        handleResetFilters={handleResetFilters}
                    />

                    {homePosts.loading && <p>Cargando...</p>}
                </div>



                <hr></hr>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item"><a href="/pages/salasfiestas">Salle des fêtes</a></li>
                        <li className="breadcrumb-item"><a href="/pages/servicios">Services</a></li>
                    </ol>
                </nav>
                <hr></hr>



            </div>

        )
    }

    return (
        <div>
            {auth.user ?
                auth.user.role === "admin" ?
                    adminauthLink()
                    : userauthLink()
                : userLink()}
        </div>



    );
}

export default Home;

