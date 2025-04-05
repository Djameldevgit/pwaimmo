import { GLOBALTYPES } from './globalTypes';
import { getDataAPI, patchDataAPI } from '../../utils/fetchData';

export const USER_TYPES_BLOCK = {
    LOADING_USER: 'LOADING_USER',
    BLOCK_USER: "BLOCK_USER",
    UNBLOCK_USER: "UNBLOCK_USER",
    GET_USERS_BLOCK: 'GET_USERS_BLOCK'
};

export const bloquearUsuario = ({ auth, datosBloqueo, user }) => async (dispatch) => {

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        const response = await patchDataAPI(`user/${user._id}/block`, {
            motivo: datosBloqueo.motivo,
            content: datosBloqueo.content,
            fechaLimite: datosBloqueo.fechaLimite,
            fechaBloqueo: datosBloqueo.fechaBloqueo
        }, auth.token);
      
        dispatch({
            type: USER_TYPES_BLOCK.BLOCK_USER,
            payload: response.data.block,
        });
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} })
        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: response.data.msg} })
     
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.msg || "Error al bloquear usuario" },
        });
    }
};


export const unBlockUser = ({ user, auth }) => async (dispatch) => {
    try {  dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })

        const response = await patchDataAPI(`user/${user._id}/unblock`, {}, auth.token);

        dispatch({
            type: USER_TYPES_BLOCK.UNBLOCK_USER,
            payload: response.data,
        });
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} })
        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: response.data.msg} })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.msg || "Error al desbloquear usuario" },
        });
    }
};


export const getBlockedUsers = (token) => async (dispatch) => {
    try {
        dispatch({ type: USER_TYPES_BLOCK.LOADING_USER, payload: true });

        const res = await getDataAPI('users/block', token);

        dispatch({
            type: USER_TYPES_BLOCK.GET_USERS_BLOCK,
            payload: { ...res.data, page: 2 } // Esto mantiene paginación si existe
        });

        dispatch({ type: USER_TYPES_BLOCK.LOADING_USER, payload: false });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.msg || "Error al obtener usuarios bloqueados" }
        });
    }
};
