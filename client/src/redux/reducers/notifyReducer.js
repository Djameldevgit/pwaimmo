import { NOTIFY_TYPES } from '../actions/notifyAction';
import { EditData } from '../actions/globalTypes';

const initialState = {
    loading: false,
    data: [],
    sound: true,
    isSubscribed: false,  // Nueva propiedad para la suscripción
    subscription: null,   // Almacena la suscripción
};

const notifyReducer = (state = initialState, action) => {
    switch (action.type) {
        case NOTIFY_TYPES.GET_NOTIFIES:
            return {
                ...state,
                data: action.payload,
            };
        case NOTIFY_TYPES.CREATE_NOTIFY:
            return {
                ...state,
                data: [action.payload, ...state.data],
            };
        case NOTIFY_TYPES.REMOVE_NOTIFY:
            return {
                ...state,
                data: state.data.filter((item) => (
                    item.id !== action.payload.id || item.url !== action.payload.url
                )),
            };
        case NOTIFY_TYPES.UPDATE_NOTIFY:
            return {
                ...state,
                data: EditData(state.data, action.payload._id, action.payload),
            };
        case NOTIFY_TYPES.UPDATE_SOUND:
            return {
                ...state,
                sound: action.payload,
            };
        case NOTIFY_TYPES.DELETE_ALL_NOTIFIES:
            return {
                ...state,
                data: action.payload,
            };

        // Nuevas acciones para suscripción
        case NOTIFY_TYPES.SUBSCRIBE:
            return {
                ...state,
                isSubscribed: true,
                subscription: action.payload.subscription, // Almacenar la suscripción
            };
        case NOTIFY_TYPES.UNSUBSCRIBE:
            return {
                ...state,
                isSubscribed: false,
                subscription: null, // Eliminar la suscripción
            };

        default:
            return state;
    }
};

export default notifyReducer;
