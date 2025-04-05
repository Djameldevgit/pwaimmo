 
import { putDataAPI } from "../../utils/fetchData";

 
export const CHANGE_LANGUAGE = {
 
  EN: 'EN',
  FR: 'FR',
  
  AR: 'AR',
  
  SYNC: 'SYNC'
}
 
 
export const synchronizeLanguage = (language, auth) => async (dispatch) => {

  try {
  
    const res = await putDataAPI(`language/${language}`, { language }, auth.token);
 
    dispatch({
      type: CHANGE_LANGUAGE.SYNC,
      payload: { language, res: res.data },
    });
  } catch (error) {
    console.error(error);  
  }
};

 
export const arabLanguage = (language, auth) => async (dispatch) => {
  
  try {
    const res = await putDataAPI('language/arabe', { language }, auth.token);
  
    dispatch({
      type: CHANGE_LANGUAGE.AR ,
      payload: { language, res: res.data },
 
    });  
  
  
    
  } catch (error) {
    console.error(error);  
 
  }
}

 


export const franchLanguage = (language, auth) => async (dispatch) => {
  
    try {
      const res = await putDataAPI('language/frances', { language }, auth.token);
        
      dispatch({
        type: CHANGE_LANGUAGE.FR,
        payload: { language, res: res.data },
      });
    } catch (error) {
      console.error(error); // Agrega el console.log aquí para mostrar el error
   
    }
  }

export const inglishLanguage = (language, auth) => async (dispatch) => {
  try {
    const res = await putDataAPI('language/ingles', { language }, auth.token);
      
    dispatch({
      type: CHANGE_LANGUAGE.EN,
      payload: { language, res: res.data },
    });
  } catch (error) {
    console.error(error); // Agrega el console.log aquí para mostrar el error
 
  }
}
 