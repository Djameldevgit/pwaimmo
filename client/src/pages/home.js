import React, { useState ,useEffect} from 'react';
import { useSelector } from 'react-redux';
import Posts from '../components/home/Posts';
import LoadIcon from '../images/loading.gif';
import WilayaCommune from '../components/WilayaCommune';
import Modalsearchhome from './../components/Modalsearchhome';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
 
//import { useHistory } from 'react-router-dom';
const Home = () => {
    const { homePosts,auth, languageReducer , userBlockReducer} = useSelector(state => state);
   
    const { t } = useTranslation();
    
    const history = useHistory();  // ✅ Usamos history aquí
 
    useEffect(() => {
        // Verifica si el usuario no está autenticado
        
        // Verifica si el usuario está bloqueado
        if (auth.user && userBlockReducer.blockedUsers) {
            const isBlocked = userBlockReducer.blockedUsers.some(userBlock => 
                userBlock.user._id === auth.user._id && userBlock.esBloqueado
            );

            if (isBlocked) {
                // Si el usuario está bloqueado, redirigir a la página de bloqueos
                history.push('/bloqueos'); // Redirige a la página de bloqueos
            }
        }
    }, [auth.token, auth.user, userBlockReducer.blockedUsers, history]);
 


    const [filters, setFilters] = useState({
        subCategory: '',
        title: '',
        wilaya: '',
        commune: '',
        startDate: '',
        endDate: '',
        minPrice: '',
        maxPrice: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const subCategories = ['Vente', 'Location', 'Echange', 'Cherche_Achat', 'Cherche_Location', ' Location_Vacances'];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const resetFilters = () => {
        setFilters({
            subCategory: '',
            title: '',
            wilaya: '',
            commune: '',
            startDate: '',
            endDate: '',
            minPrice: '',
            maxPrice: '',
        });
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="home">
    <button onClick={openModal} style={styles.searchButton} className = 'mt-2'>
        <span style={styles.searchIcon}>
            <i className='fas fa-search' ></i> 
            <span className='ml-3 '>  {t('Advanced search', { lng: languageReducer.language })}</span>
        </span>
       
    </button>

    <Modalsearchhome isOpen={isModalOpen} onClose={closeModal}>
        <div className="modalcontentsearch">
            <div className="titlebusqueda">
                <h5>Búsqueda avanzada</h5>
                <button className="modalclosesearch" onClick={closeModal}>
                    &times;
                </button>
            </div>
            <div className="filters-container">
                <div className="filter-group">
                    <select
                        name="subCategory"
                        onChange={handleFilterChange}
                        value={filters.subCategory}
                    >
                        <option value="">Sélectionner une sous-catégorie</option>
                        {subCategories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <select
                        name="title"
                        value={filters.title}
                        onChange={handleFilterChange}
                        required
                    >
                        <option value="">Sélectionner le Titre</option>
                        <option value="Appartement">Appartement</option>
                        <option value="Villa">Villa</option>
                        <option value="Local">Local</option>
                        <option value="Terrain">Terrain</option>
                        <option value="Carcasse">Carcasse</option>
                        <option value="Niveau de villa">Niveau de Villa</option>
                        <option value="Terrain Agricole">Terrain Agricole</option>
                        <option value="Immeuble">Immeuble</option>
                        <option value="Duplex">Duplex</option>
                        <option value="Studio">Studio</option>
                        <option value="Hangar">Hangar</option>
                        <option value="Bungalow">Bungalow</option>
                        <option value="Usine">Usine</option>
                        <option value="Autre">Autre</option>
                    </select>
                </div>

                <div className="filter-group">
                    <WilayaCommune filters={filters} setFilters={setFilters} />
                </div>

                <div className="filter-group">
                    <small>Fecha de inicio:</small>
                    <input
                        type="date"
                        name="startDate"
                        onChange={handleFilterChange}
                        value={filters.startDate}
                    />
                    <small>Fecha de fin:</small>
                    <input
                        type="date"
                        name="endDate"
                        onChange={handleFilterChange}
                        value={filters.endDate}
                    />
                </div>

                <div className="filter-group">
                    <small>Precio mínimo:</small>
                    <input
                        type="number"
                        name="minPrice"
                        placeholder="Precio mínimo"
                        onChange={handleFilterChange}
                        value={filters.minPrice}
                    />
                    <small>Precio máximo:</small>
                    <input
                        type="number"
                        name="maxPrice"
                        placeholder="Precio máximo"
                        onChange={handleFilterChange}
                        value={filters.maxPrice}
                    />
                </div>

                <div className="filter-group" style={{ gridColumn: '1 / -1' }}>
                    <button onClick={resetFilters} className="reset-button">
                        Reset
                    </button>
                </div>
            </div>
        </div>
    </Modalsearchhome>

    {homePosts.loading ? (
        <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
    ) : homePosts.result === 0 && homePosts.posts.length === 0 ? (
        <h3 className="text-center">Pas de nouvelles publications</h3>
    ) : (
        <Posts filters={filters} />
    )}
</div>
    );
};

const styles = {
    searchButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 1rem',
        border: '1px solid #ddd',
        borderRadius: '25px',
        backgroundColor: '#f8f9fa',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        maxWidth: '400px',
        margin: '0 auto',
    },
    searchIcon: {
        fontSize: '1.1rem',
        color: '#007bff',
        marginRight: '0.5rem',
    },
};

export default Home;