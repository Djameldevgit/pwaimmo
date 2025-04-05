import { HARAMIENTAS } from "../actions/harramientasAction";

 
 
 
const initialState = {
  harramienta: "",
  user: "null",
 
};
const haramientaeReducer = (state = initialState, action) => {
 
    switch (action.type) {
       
        case HARAMIENTAS.RIEN:
          return {
            ...state,
            harramienta: "rien",
            user: action.payload.user
          };
    
        case HARAMIENTAS.TEEFONOCAMARA:
          return {
            ...state,
            harramienta: "telefono",
            user: action.payload.user
          };
    
        case HARAMIENTAS.CAMARA:
          return {
            ...state,
            harramienta: "camara",
            user: action.payload.user
          };
    
          case HARAMIENTAS.TEEFONOCAMARA:
            return {
              ...state,
              harramienta: "telefonocamara",
              user: action.payload.user
            };
      
            case HARAMIENTAS.EFECTO1:
              return {
                ...state,
                harramienta: "efecto1",
                user: action.payload.user
              };
              case HARAMIENTAS.EFECTO2:
                return {
                  ...state,
                  harramienta: "efecto2",
                  user: action.payload.user
                };
        default:
          return state;
      }
    };
    

export default haramientaeReducer
