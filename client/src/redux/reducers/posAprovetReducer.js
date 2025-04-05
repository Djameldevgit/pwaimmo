import { POST_TYPES_APROVE } from '../actions/postAproveAction';
import { EditData  } from '../actions/globalTypes'
const initialState = {
    posts: [],
    loading: false,
    page: 1,
    result: 0
};


const postAproveReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_TYPES_APROVE.CREAR_POST_PENDIENTE:
            return {
                ...state,
                posts: [action.payload, ...state.posts]
            };
        case POST_TYPES_APROVE.APROVAR_POST_PENDIENTE:
               const updatedpost = state.posts.map((post) =>
                post._id === action.payload._id
                  ? { ...post, estado: 'aprobado' }
                  : post
              );
              return {
                ...state,
                posts: updatedpost,
              };
        case POST_TYPES_APROVE.LOADING_POST:
            return {
                ...state,
                loading: action.payload
            };
        case POST_TYPES_APROVE.GET_POSTS_PENDIENTES:
            return {
                ...state,
                posts: action.payload.posts,
                result: action.payload.result,
                page: action.payload.page
            };

            case POST_TYPES_APROVE.UPDATE_POST:
                return {
                    ...state,
                    posts: EditData(state.posts, action.payload._id, action.payload)
                };
        default:
            return state;
    }
}

export default postAproveReducer