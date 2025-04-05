import { GLOBALTYPES } from './globalTypes'
import { postDataAPI, deleteDataAPI, getDataAPI, patchDataAPI } from '../../utils/fetchData'

export const NOTIFY_TYPES = {
    GET_NOTIFIES: 'GET_NOTIFIES',
    CREATE_NOTIFY: 'CREATE_NOTIFY',
    REMOVE_NOTIFY: 'REMOVE_NOTIFY',
    UPDATE_NOTIFY: 'UPDATE_NOTIFY',
    UPDATE_SOUND: 'UPDATE_SOUND',
    DELETE_ALL_NOTIFIES: 'DELETE_ALL_NOTIFIES',
    
    // Nuevos tipos de acción relacionados con la suscripción
  //  SUBSCRIBE: 'SUBSCRIBE',
   // UNSUBSCRIBE: 'UNSUBSCRIBE',
};
/*

export const subscribeToPushNotifications = ({ auth }) => async (dispatch) => {
    try {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            console.error("Tu navegador no soporta notificaciones push.");
            return;
        }

        // Registrar el Service Worker
        const registration = await navigator.serviceWorker.register("/sw.js");

        // Solicitar permiso al usuario
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            console.error("El usuario denegó el permiso de notificaciones.");
            return;
        }

        // Suscribirse a las notificaciones push
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array("TU_CLAVE_VAPID_PUBLICA"),
        });

        // Guardar suscripción en el backend
        await postDataAPI("subscribe", { subscription }, auth.token);

        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: { success: "Suscripción exitosa a notificaciones push" } 
        });

    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: { error: err.message }
        });
    }
};
 
// Función auxiliar para convertir clave VAPID
const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};


*/

export const createNotify = ({msg, auth, socket}) => async (dispatch) => {
    try {
        const res = await postDataAPI('notify', msg, auth.token)

        socket.emit('createNotify', {
            ...res.data.notify,
            user: {
                username: auth.user.username,
                avatar: auth.user.avatar
            }
        })
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const removeNotify = ({msg, auth, socket}) => async (dispatch) => {
    try {
        await deleteDataAPI(`notify/${msg.id}?url=${msg.url}`, auth.token)
        
        socket.emit('removeNotify', msg)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const getNotifies = (token) => async (dispatch) => {
    try {
        const res = await getDataAPI('notifies', token)
        
        dispatch({ type: NOTIFY_TYPES.GET_NOTIFIES, payload: res.data.notifies })
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}


export const isReadNotify = ({msg, auth}) => async (dispatch) => {
    dispatch({type: NOTIFY_TYPES.UPDATE_NOTIFY, payload: {...msg, isRead: true}})
    try {
        await patchDataAPI(`/isReadNotify/${msg._id}`, null, auth.token)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const deleteAllNotifies = (token) => async (dispatch) => {
    dispatch({type: NOTIFY_TYPES.DELETE_ALL_NOTIFIES, payload: []})
    try {
        await deleteDataAPI('deleteAllNotify', token)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}