import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import PageRender from './customRouter/PageRender'
import PrivateRouter from './customRouter/PrivateRouter'

import Login from './pages/login'
import Register from './pages/register'

import Alert from './components/alert/Alert'
import Header from './components/header/Header'
import StatusModal from './components/StatusModal'

import { useSelector, useDispatch } from 'react-redux'
import { refreshToken } from './redux/actions/authAction'
import { getPosts } from './redux/actions/postAction'
import { getSuggestions } from './redux/actions/suggestionsAction'

import io from 'socket.io-client'
import { GLOBALTYPES } from './redux/actions/globalTypes'
import SocketClient from './SocketClient'

import { getNotifies } from './redux/actions/notifyAction'
import CallModal from './components/message/CallModal'

import { getUsers} from './redux/actions/userAction'
import UsersActionn from './pages/administration/users/UsersActionn'
import Listadeusuariosbloqueadoss from './pages/administration/users/listadeusuariosbloqueadoss'
import { getBlockedUsers } from './redux/actions/userBlockAction'
import Paginabloqueos from './pages/paginabloqueos'
import Roles from './pages/administration/users/roles'
import Homepostspendientes from './pages/administration/homepostspendientes'

import Home from './pages/home'
import Reportuser from './pages/administration/users/reportuser';
import Bloqueos from './pages/bloqueos'
import { useHistory } from 'react-router-dom';

import InfoAplicacion from './components/InfoAplicacion';


import UsersEdicion from './components/adminitration/UsersEdicion';

import { getDataAPI, postDataAPI } from './utils/fetchData';
import { getPostsPendientes } from './redux/actions/postAproveAction';
import Haramientas from './pages/administration/users/haramientas';
import EstadoActividadUser from './components/adminitration/EstadoActividadUser';


function App() {
  const { auth, status, modal, call, languageReducer, userBlockReducer } = useSelector(state => state);
  const dispatch = useDispatch();

  const history = useHistory();

  const token = auth.token;
  const language = languageReducer?.language || localStorage.getItem("lang") || "en";
  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            // manejar la ubicación aquí
        },
        error => {
            console.error(error);
        }
    );
};

  // Efecto para manejar el idioma y dirección del texto
  useEffect(() => {
    if (language === "ar") {
      document.body.classList.add("rtl");
    } else {
      document.body.classList.remove("rtl");
    }
  }, [language]);

  const [isSubscribed, setIsSubscribed] = useState(false);

  const checkExistingSubscription = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    setIsSubscribed(!!subscription);
  };

  // Ejecutar al montar el componente
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      checkExistingSubscription();
    }
  }, []);


  // Efecto para manejar usuarios bloqueados
  const blockedUser = userBlockReducer.blockedUsers.find(blockedUser => blockedUser.user._id === auth.user?._id);
  useEffect(() => {
    if (blockedUser) {
      history.push('/bloqueos');
    }
  }, [blockedUser, history]);

  // Efecto para inicializar socket y token
  useEffect(() => {

    dispatch(refreshToken());
    const socket = io();
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket });
    return () => socket.close();
  }, [dispatch]);

  // Efecto para obtener posts


  useEffect(() => {
    dispatch(getPosts());
    if (auth.token) {
      dispatch(getPostsPendientes(auth.token))
      dispatch(getSuggestions(auth.token))
      dispatch(getNotifies(auth.token))
      dispatch(getUsers(auth.token))
      dispatch(getBlockedUsers(auth.token))
       
    }
  }, [dispatch, auth.token])

  // Función para manejar la suscripción a notificaciones push
  const handleSubscription = async () => {
    try {
      // Obtener la clave pública VAPID del servidor
      const response = await getDataAPI('vapid-public-key', token);
      console.log('Respuesta de la API:', response); // Verifica la respuesta de la API

      if (!response || !response.data || !response.data.publicKey) {
        throw new Error('No se encontró la clave pública VAPID');
      }

      const publicKey = response.data.publicKey;

      // Registrar el Service Worker
      const registration = await navigator.serviceWorker.ready;

      // Suscribir al usuario al servicio push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // Enviar la suscripción al servidor
      await postDataAPI('save-subscription', { subscription }, token);
      console.log('¡Usuario suscrito con éxito!');
    } catch (err) {
      console.error('Error al suscribirse:', err.message);
    }
  };


  // Función requerida para las notificaciones push
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }


  return (
    <Router>
      <Alert />
      <input type="checkbox" id="theme" />
      <div className={`App ${(status || modal) && 'mode'}`}>
        <div className="main">
           {!blockedUser && <Header />}

           <button
            onClick={async () => {
              const permission = await Notification.requestPermission();
              if (permission === 'granted') {
                await handleSubscription();
              } else {
                alert('Las notificaciones fueron bloqueadas');
              }
            }}
            disabled={!auth.token}
          >
             
          </button>
          <button onClick={handleGetLocation}></button>


          {status && <StatusModal />}
          {auth.token && <SocketClient />}
          {call && <CallModal />}
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/administration/estadoActividadUser" component={auth.token ? EstadoActividadUser : Login} />
          <Route exact path="/administration/harramientas" component={auth.token ? Haramientas : Login} />
          <Route exact path="/informacionaplicacion" component={InfoAplicacion} />
          <Route exact path="/administration/usersaction" component={auth.token ? UsersActionn : Login} />
          <Route exact path="/administration/usersedicion" component={auth.token ? UsersEdicion : Login} />
          <Route exact path="/administration/listadeusuariosbloqueadoss" component={auth.token ? Listadeusuariosbloqueadoss : Login} />
          <Route exact path="/administration/paginabloqueos" component={auth.token ? Paginabloqueos : Login} />
          <Route exact path="/administration/homepostspendientes" component={auth.token ? Homepostspendientes : Login} />
          <Route exact path="/administration/roles" component={auth.token ? Roles : Login} />
          <Route exact path="/administration/users/reportuser" component={auth.token ? Reportuser : Login} />


          <Route exact path="/bloqueos" component={Bloqueos} />

          <PrivateRouter exact path="/:page" component={PageRender} />
          <PrivateRouter exact path="/:page/:id" component={PageRender} />
        </div>
      </div>
    </Router>
  );
}

export default App;   
