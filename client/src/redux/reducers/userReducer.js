import { USER_TYPES } from '../actions/userAction';
 
const initialState = {
    loading: false,
    users: [],
    denuncias: [],
    activeLast24hUsers: [],
    activeLast3hUsers: [],
    counttotal: 0,
    result: 0,
    page: 1,
    error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_TYPES.LOADING_USER:
            return { ...state, loading: action.payload };
        
        case USER_TYPES.GET_TOTAL_USERS_COUNT:
            return { ...state, counttotal: action.payload };
        
        case USER_TYPES.GET_USERS:
            return {
                ...state,
                users: action.payload.users,
                result: action.payload.result,
                page: action.payload.page,
            };

        case USER_TYPES.UPDATE_USER:
            return {
                ...state,
                users: state.users.map(user => 
                    user._id === action.payload._id ? action.payload : user
                ),
            };

        case USER_TYPES.DELETE_USER:
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.payload._id),
            };

        case USER_TYPES.GET_ACTIVE_USERS_LAST_24H:
            return {
                ...state,
                activeLast24hUsers: action.payload,
            };

        case USER_TYPES.GET_ACTIVE_USERS_LAST_3H:
            return {
                ...state,
                activeLast3hUsers: action.payload,
            };

        case USER_TYPES.UPDATE_USER_STATUS:
            return {
                ...state,
                users: state.users.map(user => 
                    user._id === action.payload.userId ? { ...user, status: action.payload.newStatus } : user
                ),
            };

        case USER_TYPES.CREAR_DENUNCIA:
            return {
                ...state,
                denuncias: [action.payload, ...state.denuncias],
                loading: false,
            };

        case USER_TYPES.GET_DENUNCIAS:
            return {
                ...state,
                denuncias: action.payload,
            };

        default:
            return state;
    }
};

export default userReducer;
