import { GLOBALTYPES, DeleteData } from '../actions/globalTypes'
import { postDataAPI, getDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify } from './notifyAction';
 
export const MESS_TYPES = {
    ADD_USER: 'ADD_USER',
    ADD_MESSAGE: 'ADD_MESSAGE',
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
    UPDATE_MESSAGES: 'UPDATE_MESSAGES',
    DELETE_MESSAGES: 'DELETE_MESSAGES',
    DELETE_CONVERSATION: 'DELETE_CONVERSATION',
    CHECK_ONLINE_OFFLINE: 'CHECK_ONLINE_OFFLINE'
}



export const addMessage = ({ msg, auth, socket }) => async (dispatch) => {
    // Despacha la acción para agregar el mensaje al estado
    dispatch({ type: MESS_TYPES.ADD_MESSAGE, payload: msg });

    // Emitir el mensaje a través de socket.io
    const { _id, avatar, username } = auth.user;
    socket.emit('addMessage', { ...msg, user: { _id, avatar, username } });

    try {
        // Enviar el mensaje al servidor
        await postDataAPI('message', msg, auth.token);

        // Crear la notificación para el usuario que recibe el mensaje
        const notificationMsg = {
            id: auth.user._id, // ID del usuario que envía el mensaje
            text: 'te envió un mensaje.', // Texto de la notificación
            recipients: [msg.recipient], // ID del usuario que recibe el mensaje
            url: `/message/${msg.recipient}`, // URL para redirigir al hacer clic
            content: msg.text, // Contenido del mensaje (opcional)
            image: auth.user.avatar, // Imagen del usuario que envía el mensaje (opcional)
        };

        // Despachar la acción para crear la notificación
        dispatch(createNotify({ msg: notificationMsg, auth, socket }));

    } catch (err) {
        // Manejar errores
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg },
        });
    }
};
export const getConversations = ({auth, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`conversations?limit=${page * 9}`, auth.token)
        
        let newArr = [];
        res.data.conversations.forEach(item => {
            item.recipients.forEach(cv => {
                if(cv._id !== auth.user._id){
                    newArr.push({...cv, text: item.text, media: item.media, call: item.call})
                }
            })
        })

        dispatch({
            type: MESS_TYPES.GET_CONVERSATIONS, 
            payload: {newArr, result: res.data.result}
        })

    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const getMessages = ({auth, id, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token)
        const newData = {...res.data, messages: res.data.messages.reverse()}

        dispatch({type: MESS_TYPES.GET_MESSAGES, payload: {...newData, _id: id, page}})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const loadMoreMessages = ({auth, id, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token)
        const newData = {...res.data, messages: res.data.messages.reverse()}

        dispatch({type: MESS_TYPES.UPDATE_MESSAGES, payload: {...newData, _id: id, page}})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const deleteMessages = ({msg, data, auth}) => async (dispatch) => {
    const newData = DeleteData(data, msg._id)
    dispatch({type: MESS_TYPES.DELETE_MESSAGES, payload: {newData, _id: msg.recipient}})
    try {
        await deleteDataAPI(`message/${msg._id}`, auth.token)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const deleteConversation = ({auth, id}) => async (dispatch) => {
    dispatch({type: MESS_TYPES.DELETE_CONVERSATION, payload: id})
    try {
        await deleteDataAPI(`conversation/${id}`, auth.token)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}