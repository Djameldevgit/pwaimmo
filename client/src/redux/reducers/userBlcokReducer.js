import { USER_TYPES_BLOCK } from '../actions/userBlockAction';

const initialState = {
    blockedUsers: [],
    loading: false,
    page: 1,
    result: 0
     
};
 
const userBlockReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_TYPES_BLOCK.LOADING_USER:
            return {
                ...state,
                loading: action.payload,
            };

            case USER_TYPES_BLOCK.BLOCK_USER:
                return { 
                    ...state, 
                    blockedUsers: action.payload // 🔹 Aquí guardamos solo el objeto `block`
                };

        case USER_TYPES_BLOCK.UNBLOCK_USER:
            return {
                ...state,
                blockedUsers: state.blockedUsers.filter(user => user._id !== action.payload._id),
            };

            case USER_TYPES_BLOCK.GET_USERS_BLOCK:
                return {
                  ...state,
                  blockedUsers: action.payload.blockedUsers,
                };

        default:
            return state;
    }
};

export default userBlockReducer;
