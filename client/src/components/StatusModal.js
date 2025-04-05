import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { imageShow, videoShow } from '../utils/mediaShow';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { FormCheck } from 'react-bootstrap';
import Select from 'react-select';
import communesjson from "../json/communes.json"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';  // Importar los estilos predeterminados

import { crearPostPendiente, updatePost } from '../redux/actions/postAproveAction';

const StatusModal = () => {
    const { auth, theme, socket, status, } = useSelector((state) => state);


    const dispatch = useDispatch()

    const initilastate = {

        category: "Immobiler",
        subCategory: "",


        Vente: '',
        Location: '',
        Location_Vacances: '',
        Echange: '',
        Cherche_Location: '',
        Cherche_Achat: '',

        title: "",
        description: "",
        price: "",
        unidaddeprecio: "",
        oferta: "",
        change: "",
        wilaya: "",
        commune: "",
        quartier: "",
        email: "",
        telefono: "",
        contadordevisitas: false,
        informacioncontacto: false,
        activarcomentarios:false,
        duraciondelanuncio:'',
        attributes: {
            tiempodealquiler:"",
            superficie: "",
            etage: "",
            piece: "",
            numerodeapartamientos: "",
            promoteurimmobilier: false,
            parlepromoteurimmobilier: false,
            conditiondepeyement: [],
            specifications: [],
            papiers: [],
        }
    }


    const [postData, setPostData] = useState(initilastate)
    const [images, setImages] = useState([])
    const [selectedWilaya, setSelectedWilaya] = useState("");
    
    const [stream, setStream] = useState(false)
    const videoRef = useRef()
    const refCanvas = useRef()
    const [tracks, setTracks] = useState('')

    const conditiondepeyement = [
        { label: 'Promesse de vente possible', value: 'Promesse de vente possible' },
        { label: 'Crédit bancaire possible ', value: 'Crédit bancaire possible ' },
        { label: 'Paiement par tranche possible', value: 'Paiement par tranche possible' },
    ];
    const specifications = [
        { label: 'Electricité', value: 'Electricité' },
        { label: 'Garage', value: 'Garage' },
        { label: 'Immeuble', value: 'Immeuble' },
        { label: 'Gaz', value: 'Gaz' },
        { label: 'Eau', value: 'Eau' },
    ];
    const papiers = [
        { label: 'Permet de construire', value: 'Permet de construire' },
        { label: 'Decision', value: 'Decision' },
        { label: "Act dans l'indivision", value: "Act dans l'indivision" },
        { label: 'Act notarié', value: 'Act notarié' },
        { label: 'Livret foncier', value: 'Livret foncier' },
        { label: 'Papie timbre', value: 'Papie timbre' },
    ];


    const handleWilayaChange = (event) => {
        const selectedWilaya = event.target.value;
        setSelectedWilaya(selectedWilaya);
    
        // Buscar la wilaya seleccionada
        const wilayaEncontrada = communesjson.find((wilaya) => wilaya.wilaya === selectedWilaya);
        const communes = wilayaEncontrada ? wilayaEncontrada.commune : [];
    
        // Establecer la primera comuna disponible o vacío
        
    
        // Actualizar postData con la wilaya seleccionada
        setPostData((prevState) => ({
            ...prevState,
            wilaya: selectedWilaya,
            commune: communes.length > 0 ? communes[0] : "", // Actualizar comuna si hay una disponible
        }));
    };
    const wilayasOptions = communesjson.map((wilaya, index) => (
        <option key={index} value={wilaya.wilaya}>
            {wilaya.wilaya}
        </option>
    ));
    const communesOptions = selectedWilaya
    ? communesjson
          .find((wilaya) => wilaya.wilaya === selectedWilaya)
          ?.commune?.map((commune, index) => (
              <option key={index} value={commune}>
                  {commune}
              </option>
          ))
    : [];
    const handleCommuneChange = (event) => {
        const selectedCommune = event.target.value;
        
        // Actualizar postData con la comuna seleccionada
        setPostData((prevState) => ({
            ...prevState,
            commune: selectedCommune,
        }));
    };

    const handleChangeSpecifications = (selectedOptions) => {
        setPostData(prevState => ({
            ...prevState,
            attributes: {
                ...prevState.attributes,
                specifications: selectedOptions ? selectedOptions.map(option => option.value) : []
            }
        }));
    };

    const handleChangeSelectpapiers = (selectedOptions) => {
        setPostData(prevState => ({
            ...prevState,
            attributes: {
                ...prevState.attributes,
                papiers: selectedOptions ? selectedOptions.map(option => option.value) : []
            }
        }));
    };


    const handleChangeSelectconditiondepeyement = (selectedOptions) => {
        setPostData(prevState => ({
            ...prevState,
            attributes: {
                ...prevState.attributes,
                conditiondepeyement: selectedOptions ? selectedOptions.map(option => option.value) : []
            }
        }));
    };




    const handleChangeInput = (e) => {
        const { name, value, type, checked } = e.target;

        setPostData(prevState => {
            const isCheckbox = type === "checkbox";

            // Verificamos si el name pertenece a attributes
            const isAttribute = prevState.attributes && Object.prototype.hasOwnProperty.call(prevState.attributes, name);

            if (isAttribute) {
                // ✅ Si el campo pertenece a attributes, actualizamos dentro de attributes
                return {
                    ...prevState,
                    attributes: {
                        ...prevState.attributes,
                        [name]: isCheckbox ? checked : value
                    }
                };
            } else {
                // ✅ Si es un campo normal, lo actualizamos directamente
                return {
                    ...prevState,
                    [name]: isCheckbox ? checked : value
                };
            }
        });
    };





    const handleChangeImages = e => {
        const files = [...e.target.files]
        let err = ""
        let newImages = []

        files.forEach(file => {
            if (!file) return err = "File does not exist."

            if (file.size > 1024 * 1024 * 5) {
                return err = "The image/video largest is 5mb."
            }

            return newImages.push(file)
        })

        if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } })
        setImages([...images, ...newImages])
    }

    const deleteImages = (index) => {
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)
    }

    const handleStream = () => {
        setStream(true)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(mediaStream => {
                    videoRef.current.srcObject = mediaStream
                    videoRef.current.play()

                    const track = mediaStream.getTracks()
                    setTracks(track[0])
                }).catch(err => console.log(err))
        }
    }

    const handleCapture = () => {
        const width = videoRef.current.clientWidth;
        const height = videoRef.current.clientHeight;

        refCanvas.current.setAttribute("width", width)
        refCanvas.current.setAttribute("height", height)

        const ctx = refCanvas.current.getContext('2d')
        ctx.drawImage(videoRef.current, 0, 0, width, height)
        let URL = refCanvas.current.toDataURL()
        setImages([...images, { camera: URL }])
    }

    const handleStopStream = () => {
        tracks.stop()
        setStream(false)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!postData.wilaya || !postData.commune) {
            return dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: "Por favor selecciona una wilaya y una comuna." },
            });
        }
        if (images.length === 0) {
            return dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: "Por favor agrega una foto o video." },
            });
        }

        if (status.onEdit) {
            dispatch(updatePost({ postData, images, auth, status }));
        } else {
            dispatch(crearPostPendiente({ postData, images, auth, socket }));
        }

        setPostData(initilastate);
        setImages([]);
        if (tracks) tracks.stop();
        dispatch({ type: GLOBALTYPES.STATUS, payload: false });
    };

    useEffect(() => {
        console.log("status en useEffect:", status);
        if (status?.onEdit) {
            setPostData({
                subCategory: status.subCategory || "",
                Vente: status.Vente || "",
                Location: status.Location || "",
                Echange: status.Echange || "",
                Cherche_Location: status.Cherche_Location || "",
                Cherche_Achat: status.Cherche_Achat || "",
                Location_Vacances: status.Location_Vacances || "",
                title: status.title || "",
                description: status.description || "",
                price: status.price || "",
                unidaddeprecio: status.unidaddeprecio || "",
                oferta: status.oferta || "",
                change: status.change || "",
                wilaya: status.wilaya || "",
                commune: status.commune || "",
                quartier: status.quartier || "",
                email: status.email || "",
                telefono: status.telefono || "",
                contadordevisitas: status.contadordevisitas || false,
                informacioncontacto: status.informacioncontacto || false,
                activarcomentarios: status.activarcomentarios || false,
                duraciondelanuncio: status.duraciondelanuncio || "",
                attributes: {
                    superficie: status.attributes?.superficie || "",
                    etage: status.attributes?.etage || "",
                    piece: status.attributes?.piece || "",
                    numerodeapartamientos:status.attributes?.numerodeapartamientos || "",
                    promoteurimmobilier: status.attributes?.promoteurimmobilier || false,
                    parlepromoteurimmobilier: status.attributes?.parlepromoteurimmobilier || false,
                    conditiondepeyement: status.attributes?.conditiondepeyement || [],
                    specifications: status.attributes?.specifications || [],
                    papiers: status.attributes?.papiers || [],
                },
            });
            setImages(status.images || []);
            setSelectedWilaya(status.wilaya || "");
       

        }
    }, [status]);

    const subcategoryy = () => (
        <div className="form-group">
            <select name="subCategory" value={postData.subCategory} onChange={handleChangeInput} className="form-control" required>
                <option value="">Catégorie...</option>
                <option value="Vente">Vente</option>
                <option value="Location">Location</option>
                <option value="Location_Vacances">Location pour Vacances</option>
                <option value="Echange">Echange</option>
                <option value="Cherche_Location">Cherche Location</option>
                <option value="Cherche_Achat">Cherche Achat</option>
            </select>
            <small className='text-danger'>Ce champ est requis</small>
        </div>
    )

    const itemsvente = () => (
        <div>
            <select style={{ display: "flex", alignItems: "flex-end" }}
                onChange={handleChangeInput}
                value={postData.title} name="title" className="form-control" required >  <option value="">Sélectionner une sub catégorie</option>
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
            <small className='text-danger'>Ce champ est requis</small>
        </div>
    )
    const superficie = () => (
        <div>
            <input
                type="number"
                name="superficie"
                value={postData.attributes.superficie}
                onChange={handleChangeInput}
                className="form-control"
                placeholder="Superficie en M²"
            />
        </div>
    )
    const etage = () => (
        <div>
            <input
                type="number"
                name="etage"
                value={postData.attributes.etage}
                onChange={handleChangeInput}
                className="form-control"
                placeholder="Etage(s)"
            />
        </div>
    )
    const piece = () => (
        <div>
            <input
                type="number"
                name="piece"
                value={postData.attributes.piece}
                onChange={handleChangeInput}
                className="form-control"
                placeholder="Pièces"
            />
        </div>
    )

const numerodeapartamientos = ()=>(
    <div>
    <input
        type="number"
        name="numerodeapartamientos"
        value={postData.attributes.numerodeapartamientos}
        onChange={handleChangeInput}
        className="form-control"
        placeholder="Nombre d’appartements"
    />
</div>
 )

    const promoteurimmobilier = () => (
        <FormCheck
            type="checkbox"
            name="promoteurimmobilier"
            checked={postData.attributes.promoteurimmobilier}
            onChange={handleChangeInput}
            label="Promotion immobilière"
        />
    )

    const parlepromoteurimmobilier = () => (
        <FormCheck
            type="checkbox"
            name="parlepromoteurimmobilier"
            checked={postData.attributes.parlepromoteurimmobilier}
            onChange={handleChangeInput}
            label="Parle du promoteur immobilier"
        />
    )
    const conditiondepeyemente = () => (
        <Select
            placeholder="Conditions de paiement"
            value={conditiondepeyement.filter(obj => postData.attributes.conditiondepeyement && postData.attributes.conditiondepeyement.includes(obj.value))}
            options={conditiondepeyement}
            onChange={handleChangeSelectconditiondepeyement}
            isMulti={true}
        />
    )
    const specificaciones = () => (
        <Select
            placeholder="Spécifications"
            value={specifications.filter(obj => postData.attributes.specifications && postData.attributes.specifications.includes(obj.value))}
            options={specifications}
            onChange={handleChangeSpecifications}
            isMulti={true}
            closeMenuOnSelect={false}
        />
    )
    const papeles = () => (
        <Select
            placeholder="paiers"
            value={papiers.filter(obj => postData.attributes.papiers && postData.attributes.papiers.includes(obj.value))}
            options={papiers}
            onChange={handleChangeSelectpapiers}
            isMulti={true}
            closeMenuOnSelect={false}
        />
    )



    ///ALGUQUILERRRRRRRRRRRRRRRRRRRRRRRRRR
    const pagopor = () => (
        <div className="form-group">
            <label className='text-primary'> Transaction</label>
            <select
                multiple={false}
                name="tiempodealquiler"
                value={postData.tiempodealquiler}
                onChange={handleChangeInput}
                className="form-control"
            >
                <option >Paiement par</option>
                <option value="Jour">Jour</option>
                <option value="Semaine">Semaine</option>
                <option value="1 mois">1 mois</option>
                <option value="3 mois">3 mois</option>
                <option value="1 mois">1 mois</option>
                <option value="12 mois">12 mois</option>
                <option value="24 mois">24 mois</option>
                <option value="Plus de 24 mois">Plus de 24 mois</option>

            </select>
        </div>
    )


    const itemsventelocationvacances = () => (
        <div>
            <select style={{ display: "flex", alignItems: "flex-end" }}
                onChange={handleChangeInput}
                value={postData.title} name="title" className="form-control" required >  <option value="">Sélectionner une sub catégorie</option>
                <option value="Appartement">Appartement</option>
                <option value="Villa">Villa</option>
                <option value="Local">Local</option>
                <option value="Niveau de villa">Niveau de Villa</option>
                <option value="Duplex">Duplex</option>
                <option value="Studio">Studio</option>
                <option value="Bungalow">Bungalow</option>
                <option value="Autre">Autre</option>
            </select>
            <small className='text-danger'>Ce champ est requis</small>
        </div>
    )




    return (
        <div className='status_modal'  >
            <form onSubmit={handleSubmit}>
                <div className="status_header">
                    <h5 className="m-0">Annonces Immobilière</h5>
                    <span onClick={() => dispatch({
                        type: GLOBALTYPES.STATUS, payload: false
                    })}>
                        &times;
                    </span>
                </div>
                <div className="status_body">
                    <div className="form-group"   >
                        <input
                            className='form-control'
                            type="hidden"
                            name="category"
                            value={postData.category}
                            onChange={handleChangeInput}
                            placeholder="Category" />
                    </div>
                    <div className="form-group">
                        {subcategoryy()}
                    </div>




 


                    {postData.subCategory === "Vente" && (
                        <div>
                            <div className="form-group">
                                {itemsvente()}
                            </div>

                            {postData.title === "Appartement" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>
                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Terrain" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Villa" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>

                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Local" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>

                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Carcasse" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Niveau de villa" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {postData.title === "Terrain Agricole" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Immeuble" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {numerodeapartamientos()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Duplex" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>

                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>

                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Studio" && (
                                <div>
                                    <div className='form-group'>
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                name="superficie"
                                                value={postData.attributes.superficie}
                                                onChange={handleChangeInput}
                                                className="form-control"
                                                placeholder="Superficie en M²"
                                            />
                                        </div>
                                        <div className="form-group"  >
                                            <input
                                                type="number"
                                                name="etage"
                                                value={postData.attributes.etage}
                                                onChange={handleChangeInput}
                                                className="form-control"
                                                placeholder="Etage(s)"
                                            />
                                        </div>

                                        <div className="form-group" >
                                            <div className="form-group" >
                                                {promoteurimmobilier()}
                                            </div>

                                            <div className="form-group"  >
                                                {parlepromoteurimmobilier()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Hangar" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Bungalow" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Usine" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>

                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Autre" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}


































                    {postData.subCategory === "Location" && (
                        <div>
                            <div className="form-group">
                                {itemsvente()}
                            </div>

                            {postData.title === "Appartement" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {pagopor()}
                                    </div>
                                    <div className="form-group"  >
                                        {superficie()}
                                    </div>

                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>
                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Terrain" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Villa" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>

                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Local" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>

                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Carcasse" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Niveau de villa" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {postData.title === "Terrain Agricole" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Immeuble" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Duplex" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>

                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>

                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Studio" && (
                                <div>
                                    <div className='form-group'>
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                name="superficie"
                                                value={postData.attributes.superficie}
                                                onChange={handleChangeInput}
                                                className="form-control"
                                                placeholder="Superficie en M²"
                                            />
                                        </div>
                                        <div className="form-group"  >
                                            <input
                                                type="number"
                                                name="etage"
                                                value={postData.attributes.etage}
                                                onChange={handleChangeInput}
                                                className="form-control"
                                                placeholder="Etage(s)"
                                            />
                                        </div>

                                        <div className="form-group" >
                                            <div className="form-group" >
                                                {promoteurimmobilier()}
                                            </div>

                                            <div className="form-group"  >
                                                {parlepromoteurimmobilier()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Hangar" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Bungalow" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Usine" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>

                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Autre" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}


























                    {postData.subCategory === "Location_Vacances" && (
                        <div>
                            <div className="form-group">
                                {itemsventelocationvacances()}
                            </div>

                            {postData.title === "Appartement" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {pagopor()}
                                    </div>

                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>

                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {postData.title === "Villa" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {pagopor()}
                                    </div>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>

                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>

                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}


                            {postData.title === "Niveau de villa" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {pagopor()}
                                    </div>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>

                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>

                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {postData.title === "Duplex" && (

                                <div className='form-group'>
                                    <div className="form-group">
                                        {pagopor()}
                                    </div>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>

                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>

                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>

                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Studio" && (
                                <div>
                                    <div className='form-group'>
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                name="superficie"
                                                value={postData.attributes.superficie}
                                                onChange={handleChangeInput}
                                                className="form-control"
                                                placeholder="Superficie en M²"
                                            />
                                        </div>
                                        <div className="form-group"  >
                                            <input
                                                type="number"
                                                name="etage"
                                                value={postData.attributes.etage}
                                                onChange={handleChangeInput}
                                                className="form-control"
                                                placeholder="Etage(s)"
                                            />
                                        </div>

                                        <div className="form-group" >
                                            <div className="form-group" >
                                                {promoteurimmobilier()}
                                            </div>

                                            <div className="form-group"  >
                                                {parlepromoteurimmobilier()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Hangar" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Bungalow" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Usine" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>

                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Autre" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
















                    {postData.subCategory === "Echange" && (
                        <div>
                            <div className="form-group">
                                {itemsvente()}
                            </div>

                            {postData.title === "Appartement" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>
                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Terrain" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Villa" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>

                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Local" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>

                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Carcasse" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Niveau de villa" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {postData.title === "Terrain Agricole" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Immeuble" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Duplex" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>

                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>

                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Studio" && (
                                <div>
                                    <div className='form-group'>
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                name="superficie"
                                                value={postData.attributes.superficie}
                                                onChange={handleChangeInput}
                                                className="form-control"
                                                placeholder="Superficie en M²"
                                            />
                                        </div>
                                        <div className="form-group"  >
                                            <input
                                                type="number"
                                                name="etage"
                                                value={postData.attributes.etage}
                                                onChange={handleChangeInput}
                                                className="form-control"
                                                placeholder="Etage(s)"
                                            />
                                        </div>

                                        <div className="form-group" >
                                            <div className="form-group" >
                                                {promoteurimmobilier()}
                                            </div>

                                            <div className="form-group"  >
                                                {parlepromoteurimmobilier()}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="text-primary">Spécifications</label>
                                            <div className="form-group">
                                                {conditiondepeyemente()}
                                            </div>
                                            <div className="form-group">
                                                {specificaciones()}
                                            </div>
                                            <div className="form-group">
                                                {papeles()}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}
                            {postData.title === "Hangar" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Bungalow" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Usine" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>

                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Autre" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}






















                    {postData.subCategory === "Cherche_Location" && (
                        <div>
                            <div className="form-group">
                                {itemsvente()}
                            </div>

                            {postData.title === "Appartement" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {pagopor()}
                                    </div>
                                    <div className="form-group"  >
                                        {superficie()}
                                    </div>

                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>
                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {postData.title === "Villa" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {pagopor()}
                                    </div>

                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>

                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Local" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {pagopor()}
                                    </div>

                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>

                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Carcasse" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {pagopor()}
                                    </div>

                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Niveau de villa" && (
                                <div className='form-group'>

                                    <div className="form-group">
                                        {pagopor()}
                                    </div>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {postData.title === "Terrain Agricole" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {pagopor()}
                                    </div>

                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Immeuble" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {pagopor()}
                                    </div>

                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Duplex" && (
                                <div className='form-group'>

                                    <div className="form-group">
                                        {pagopor()}
                                    </div>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>

                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>

                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Studio" && (
                                <div>
                                    <div className='form-group'>
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                name="superficie"
                                                value={postData.attributes.superficie}
                                                onChange={handleChangeInput}
                                                className="form-control"
                                                placeholder="Superficie en M²"
                                            />
                                        </div>
                                        <div className="form-group"  >
                                            <input
                                                type="number"
                                                name="etage"
                                                value={postData.attributes.etage}
                                                onChange={handleChangeInput}
                                                className="form-control"
                                                placeholder="Etage(s)"
                                            />
                                        </div>

                                        <div className="form-group" >
                                            <div className="form-group" >
                                                {promoteurimmobilier()}
                                            </div>

                                            <div className="form-group"  >
                                                {parlepromoteurimmobilier()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Hangar" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Bungalow" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Usine" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>

                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Terrain" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {postData.title === "Autre" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}


















                    {postData.subCategory === "Cherche_Achat" && (

                        <div>
                            <div className="form-group">
                                {itemsvente()}
                            </div>

                            {postData.title === "Appartement" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>
                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Terrain" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Villa" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>

                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Local" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>

                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Carcasse" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Niveau de villa" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {postData.title === "Terrain Agricole" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Immeuble" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Duplex" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>

                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group" >
                                        <div className="form-group" >
                                            {promoteurimmobilier()}
                                        </div>

                                        <div className="form-group"  >
                                            {parlepromoteurimmobilier()}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Studio" && (
                                <div>
                                    <div className='form-group'>
                                        <div className="form-group">
                                            {superficie()}
                                        </div>
                                        <div className="form-group"  >
                                            {etage()}
                                        </div>

                                        <div className="form-group" >
                                            <div className="form-group" >
                                                {promoteurimmobilier()}
                                            </div>

                                            <div className="form-group"  >
                                                {parlepromoteurimmobilier()}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="text-primary">Spécifications</label>
                                            <div className="form-group">
                                                {conditiondepeyemente()}
                                            </div>
                                            <div className="form-group">
                                                {specificaciones()}
                                            </div>
                                            <div className="form-group">
                                                {papeles()}
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            )}
                            {postData.title === "Hangar" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group"  >
                                        {etage()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Bungalow" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        {piece()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Usine" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>

                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postData.title === "Autre" && (
                                <div className='form-group'>
                                    <div className="form-group">
                                        {superficie()}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-primary">Spécifications</label>
                                        <div className="form-group">
                                            {conditiondepeyemente()}
                                        </div>
                                        <div className="form-group">
                                            {specificaciones()}
                                        </div>
                                        <div className="form-group">
                                            {papeles()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}











                    <div className="form-group">
                        <textarea name="description" value={postData.description}
                            onChange={handleChangeInput}
                            placeholder='Description...'
                        />
                    </div>
                    <div className="card-body form-group">
                        <label className="text-primary">Prix</label>
                        <div style={{ padding: '0 20px' }}>
                            <Slider
                                min={500}
                                max={2000000}
                                step={500}
                                value={postData.price || 0} // Si no hay precio, el slider empieza en 0
                                onChange={(value) => {
                                    setPostData(prevState => ({
                                        ...prevState,
                                        price: value // Solo actualizamos el valor de 'price'
                                    }));
                                }}
                                trackStyle={{ backgroundColor: '#44EB00', height: 10 }}
                                handleStyle={{
                                    borderColor: '#00AF72',
                                    height: 20,
                                    width: 20,
                                    marginLeft: -10,
                                    marginTop: -5,
                                    backgroundColor: '#007bff',
                                }}
                                railStyle={{ backgroundColor: '#ccc', height: 10 }}
                            />
                        </div>

                        <div style={{ marginTop: 10 }}>
                            {postData.price}
                        </div>
                    </div>

                    <div className="form-group">

                        <select
                            multiple={false}
                            name="unidaddeprecio"
                            value={postData.unidaddeprecio}
                            onChange={handleChangeInput}
                            className="form-control"
                        >
                            <option  >Unité de prix</option>
                            <option value="DA">DA</option>
                            <option value="Millions">Millions</option>
                            <option value="Milliard">Milliard</option>
                            <option value="DA (m²)">DA (m²)</option>
                            <option value="Millions (m²) ">Millions (m²)</option>

                        </select>
                    </div>

                    <div className="form-group">

                        <select
                            multiple={false}
                            name="oferta"
                            value={postData.oferta}
                            onChange={handleChangeInput}
                            className="form-control"
                        >
                            <option >Type D'offre</option>
                            <option value="Fixe">Fixe</option>
                            <option value="Négociable">Négociable</option>
                            <option value="Offert">Offert</option>

                        </select>
                    </div>

                    <div className="form-group">

                        <select
                            multiple={false}
                            name="change"
                            value={postData.change}
                            onChange={handleChangeInput}
                            className="form-control"
                        >
                            <option  >Change</option>

                            <option value="J'accepte l'échange">J'accepte l'échange</option>
                            <option value="Pas d'échanges">Pas d'échanges </option>

                        </select>
                    </div>

                    <div className="form-group">
                <small className="text-primary">Adresse du bien obligatoire</small>
                <select
                    multiple={false}
                    className="form-control"
                    name="wilaya"
                    value={postData.wilaya} // Usar postData.wilaya
                    onChange={handleWilayaChange}
                >
                    <option value="">Sélectionnez une wilaya</option>
                    {wilayasOptions} {/* Opciones de wilayas */}
                </select>
                <small className="text-danger">Ce champ est requis</small>
            </div>

            {/* Campo Commune */}
            <div className="form-group">
                <select
                    multiple={false}
                    className="form-control"
                    name="commune"
                    value={postData.commune} // Usar postData.commune
                    onChange={handleCommuneChange}
                >
                    <option value="">Sélectionnez la commune</option>
                    {communesOptions} {/* Opciones de communes */}
                </select>
                <small className="text-danger">Ce champ est requis</small>
            </div>

                    <div className="form-group">

                        <input onChange={handleChangeInput} value={postData.quartier} name="quartier" type="text" className="form-control" placeholder='Quartier' />

                    </div>

                    <div className="form-group">

                        <input onChange={handleChangeInput} value={postData.telefono} name="telefono" type="number" className="form-control" placeholder='Téléphone' />

                    </div>


                    <div className="form-group">

                        <input onChange={handleChangeInput} value={postData.email} name="email" type="email" className="form-control" placeholder='Adresse mail ' />
                        <small className='text-danger'>Ce champ est requis</small>
                    </div>



                    <div>
                        <label className="text-primary">Options Générales</label>
                        <div className="form-group">
                            <FormCheck
                                type="checkbox"
                                checked={postData.contadordevisitas}
                                onChange={(e) => setPostData({ ...postData, contadordevisitas: e.target.checked })}
                                label="Afficher lo compteur des visites"
                            />
                        </div>
                        <div className="form-group">
                            <FormCheck
                                type="checkbox"
                                checked={postData.informacioncontacto}
                                onChange={(e) => setPostData({ ...postData, informacioncontacto: e.target.checked })}
                                label="Autoriser les informations de contact"
                            />
                        </div>

                        <div className="form-group">
                            <FormCheck
                                type="checkbox"
                                checked={postData.activarcomentarios}
                                onChange={(e) => setPostData({ ...postData, activarcomentarios: e.target.checked })}
                                label="Activer les commentaires"
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-primary">Durée de l' annonces</label>
                            <select
                                multiple={false}
                                onChange={handleChangeInput} value={postData.duraciondelanuncio} name="duraciondelanuncio" className="form-control" >

                                <option value="nepasdesactiver">Ne pas désactiver</option>
                                <option value="15 jour">15 Jours</option>
                                <option value="1 mois">1 Mois</option>
                                <option value="3 mois">3 Mois</option>
                                <option value="6 mois">6 Mois</option>

                            </select>
                        </div>


                    </div>


                    <div className="show_images">
                        {
                            images.map((img, index) => (
                                <div key={index} id="file_img">
                                    {
                                        img.camera ? imageShow(img.camera, theme)
                                            : img.url
                                                ? <>
                                                    {
                                                        img.url.match(/video/i)
                                                            ? videoShow(img.url, theme)
                                                            : imageShow(img.url, theme)
                                                    }
                                                </>
                                                : <>
                                                    {
                                                        img.type.match(/video/i)
                                                            ? videoShow(URL.createObjectURL(img), theme)
                                                            : imageShow(URL.createObjectURL(img), theme)
                                                    }
                                                </>
                                    }
                                    <span onClick={() => deleteImages(index)}>&times;</span>
                                </div>
                            ))
                        }
                    </div>

                    {
                        stream &&
                        <div className="stream position-relative">
                            <video autoPlay muted ref={videoRef} width="100%" height="100%"
                                style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />

                            <span onClick={handleStopStream}>&times;</span>
                            <canvas ref={refCanvas} style={{ display: 'none' }} />
                        </div>
                    }

                    <div className="input_images">
                        {
                            stream
                                ? <i className="fas fa-camera" onClick={handleCapture} />
                                : <>
                                    <i className="fas fa-camera" onClick={handleStream} />

                                    <div className="file_upload">
                                        <i className="fas fa-image" />
                                        <input type="file" name="file" id="file"
                                            multiple accept="image/*,video/*" onChange={handleChangeImages} />
                                    </div>
                                </>
                        }

                    </div>



                    <div className="status_footer">
                        <button className="btn btn-secondary w-100" type="submit">
                            Publie
                        </button>
                    </div>
                </div>
            </form >
        </div >
    )
}

export default StatusModal
