import { patchDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from './globalTypes'
export const ROLES_TYPES = {
  LOADING: 'LOADING',
  USER_ROLE: 'USER_ROLE',
  SUPERUSER_ROLE: 'SUPERUSER_ROLE',
  MODERADOR_ROLE: 'MODERADOR_ROLE',
  ADMIN_ROLE: 'ADMIN_ROLE',
  STORY_ROLE: 'STORY_ROLE'

}


export const roleuserautenticado = (user, auth) => async (dispatch) => {
  try {
    dispatch({ type: ROLES_TYPES.LOADING, payload: true })
    const res = await patchDataAPI(`user/${user._id}/roleuser`, { role: 'user' }, auth.token);
    dispatch({
      type: ROLES_TYPES.USER_ROLE,
      payload: { user, res: res.data }
    });

    dispatch({ type: ROLES_TYPES.LOADING, payload: false })
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg }
    });
  }
};

// Ejemplo de acción para actualizar el rol a "superuser"
export const rolesuperuser = (user, auth) => async (dispatch) => {
  try {
    dispatch({ type: ROLES_TYPES.LOADING, payload: true });

    const res = await patchDataAPI(`user/${user._id}/rolesuperuser`, { role: 'superuser' }, auth.token);

    dispatch({
      type: ROLES_TYPES.SUPERUSER_ROLE,
      payload: { user: { ...user, role: 'superuser' } } // Se envía el usuario con el rol actualizado
    });

    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
  }
};

export const rolemoderador = (user, auth) => async (dispatch) => {
  try {
    dispatch({ type: ROLES_TYPES.LOADING, payload: true })
    const res = await patchDataAPI(`user/${user._id}/rolemoderador`, { role: 'moderador' }, auth.token);

    dispatch({
      type: ROLES_TYPES.MODERADOR_ROLE,
      payload: { user, res: res.data }
    });
    dispatch({ type: ROLES_TYPES.LOADING, payload: false })
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg }
    });
  }
};
export const roleadmin = (user, auth) => async (dispatch) => {
  try {
    dispatch({ type: ROLES_TYPES.LOADING, payload: true })
    const res = await patchDataAPI(`user/${user._id}/roleadmin`, { role: 'admin' }, auth.token);

    dispatch({
      type: ROLES_TYPES.ADMIN_ROLE,
      payload: { user, res: res.data }
    });
    dispatch({ type: ROLES_TYPES.LOADING, payload: false })
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg }
    });
  }
};

export const rolestory = (user, auth) => async (dispatch) => {
  try {
    dispatch({ type: ROLES_TYPES.LOADING, payload: true })
    const res = await patchDataAPI(`user/${user._id}/rolestory`, { role: 'story' }, auth.token);

    dispatch({
      type: ROLES_TYPES.STORY_ROLE,
      payload: { user, res: res.data }
    });
    dispatch({ type: ROLES_TYPES.LOADING, payload: false })
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg }
    });
  }
};