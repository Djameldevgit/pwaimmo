import { patchDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from './globalTypes'
export const HARAMIENTAS = {
  LOADING: 'LOADING',
  RIEN: 'RIEN',
  TELEFONO: 'TELEFONO',
  CAMARA: 'CAMARA',
  TEEFONOCAMARA: 'TEEFONOCAMARA',
  IMAGES: 'IMAGES',
  EFECTO1: 'EFECTO1',
  EFECTO2: 'EFECTO2'
}


export const Rien = (user, auth) => async (dispatch) => {
  try {
    dispatch({ type: HARAMIENTAS.LOADING, payload: true })
    const res = await patchDataAPI(`user/${user._id}`, { harramienta: 'rien' }, auth.token);
    dispatch({
      type: HARAMIENTAS.RIEN,
      payload: { user, res: res.data }
    });

    dispatch({ type: HARAMIENTAS.LOADING, payload: false })
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg }
    });
  }
};

// Ejemplo de acción para actualizar el rol a "superuser"
export const Telefono = (user, auth) => async (dispatch) => {
  try {
    dispatch({ type: HARAMIENTAS.LOADING, payload: true });

    const res = await patchDataAPI(`user/${user._id}`, { harramienta: 'telefono' }, auth.token);

    dispatch({
      type: HARAMIENTAS.TELEFONO,
      payload: { user: { ...user, harramienta: 'telefono' } } // Se envía el usuario con el rol actualizado
    });

    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
    dispatch({ type: HARAMIENTAS.LOADING, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
    dispatch({ type: HARAMIENTAS.LOADING, payload: false });
  }
};
export const Camara = (user, auth) => async (dispatch) => {
  try {
    dispatch({ type: HARAMIENTAS.LOADING, payload: true })
    const res = await patchDataAPI(`user/${user._id}`, { harramienta: 'camara' }, auth.token);

    dispatch({
      type: HARAMIENTAS.CAMARA,
      payload: { user, res: res.data }
    });
    dispatch({ type: HARAMIENTAS.LOADING, payload: false })
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg }
    });
  }
};

export const Images = (user, auth) => async (dispatch) => {
  try {
    dispatch({ type: HARAMIENTAS.LOADING, payload: true })
    const res = await patchDataAPI(`user/${user._id}`, { harramienta: 'images' }, auth.token);

    dispatch({
      type: HARAMIENTAS.IMAGES,
      payload: { user, res: res.data }
    });
    dispatch({ type: HARAMIENTAS.LOADING, payload: false })
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg }
    });
  }
};
export const Telefonocamara = (user, auth) => async (dispatch) => {
  try {
    dispatch({ type: HARAMIENTAS.LOADING, payload: true })
    const res = await patchDataAPI(`user/${user._id}`, { harramienta: 'telefonocamara' }, auth.token);

    dispatch({
      type: HARAMIENTAS.CAMARA,
      payload: { user, res: res.data }
    });
    dispatch({ type: HARAMIENTAS.LOADING, payload: false })
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg }
    });
  }
};

 
export const Efecto1 = (user, auth) => async (dispatch) => {
  try {
    dispatch({ type: HARAMIENTAS.LOADING, payload: true })
    const res = await patchDataAPI(`user/${user._id}`, { harramienta: 'efecto1' }, auth.token);

    dispatch({
      type: HARAMIENTAS.EFECTO1,
      payload: { user, res: res.data }
    });
    dispatch({ type: HARAMIENTAS.LOADING, payload: false })
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg }
    });
  }
};
 

export const Efecto2 = (user, auth) => async (dispatch) => {
  try {
    dispatch({ type: HARAMIENTAS.LOADING, payload: true })
    const res = await patchDataAPI(`user/${user._id}`, { harramienta: 'efecto2' }, auth.token);

    dispatch({
      type: HARAMIENTAS.EFECTO2,
      payload: { user, res: res.data }
    });
    dispatch({ type: HARAMIENTAS.LOADING, payload: false })
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg }
    });
  }
};