import { GLOBALTYPES } from './globalTypes'
import { postDataAPI } from '../../utils/fetchData'
import valid from '../../utils/valid'


export const login = (data) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        const res = await postDataAPI('login', data)
        dispatch({ 
            type: GLOBALTYPES.AUTH, 
            payload: {
                token: res.data.access_token,
                user: res.data.user
            } 
        })

        localStorage.setItem("firstLogin", true)
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                success: res.data.msg
            } 
        })
        
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}


export const refreshToken = () => async (dispatch) => {
    const firstLogin = localStorage.getItem("firstLogin")
    if(firstLogin){
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })

        try {
            const res = await postDataAPI('refresh_token')
            dispatch({ 
                type: GLOBALTYPES.AUTH, 
                payload: {
                    token: res.data.access_token,
                    user: res.data.user
                } 
            })

            dispatch({ type: GLOBALTYPES.ALERT, payload: {} })

        } catch (err) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    error: err.response.data.msg
                } 
            })
        }
    }
}

export const register = (data) => async (dispatch) => {
    const check = valid(data);
    if (check.errLength > 0)
        return dispatch({ type: GLOBALTYPES.ALERT, payload: check.errMsg });

    // Primero obtenemos la ubicación
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        // Ahora agregamos la ubicación al objeto 'data'
        const registerData = {
            ...data,
            location: { lat: latitude, lng: longitude }
        };

        try {
            dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

            // Enviamos los datos (incluyendo la ubicación) a la API
            const res = await postDataAPI('register', registerData);

            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: {
                    token: res.data.access_token,
                    user: res.data.user
                }
            });

            localStorage.setItem("firstLogin", true);
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.msg
                }
            });
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: err.response.data.msg
                }
            });
        }
    }, 
    (error) => {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: "No se pudo obtener la ubicación."
            }
        });
    });
};


export const logout = () => async (dispatch) => {
    try {
        localStorage.removeItem('firstLogin')
        await postDataAPI('logout')
        window.location.href = "/"
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}