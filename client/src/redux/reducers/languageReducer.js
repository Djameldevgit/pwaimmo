import { CHANGE_LANGUAGE } from "../actions/languageAction";

 

const initialState = {
  language: 'fr'
};
 
const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_LANGUAGE.EN:
      return {
        ...state,
        language: "en",
      };
    case CHANGE_LANGUAGE.FR:
      return {
        ...state,
        language: "fr",
      };
    
    case CHANGE_LANGUAGE.AR:
      return {
        ...state,
        language: "ar",
      };
     
      case CHANGE_LANGUAGE.SYNC:
        return {
          ...state,
          language: action.payload.language, // Antes estaba "SYNC"
        };
      
  
    default:
      return state;
  }
};
//action.payload
export default languageReducer;
