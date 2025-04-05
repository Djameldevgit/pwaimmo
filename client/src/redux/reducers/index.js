import { combineReducers } from 'redux'
import auth from './authReducer'
import alert from './alertReducer'
import theme from './themeReducer'
import profile from './profileReducer'
import status from './statusReducer'
import homePosts from './postReducer'
import modal from './modalReducer'
import detailPost from './detailPostReducer'
import discover from './discoverReducer'
import suggestions from './suggestionsReducer'
import socket from './socketReducer'
import notify from './notifyReducer'
import message from './messageReducer'
import online from './onlineReducer'
import call from './callReducer'
import peer from './peerReducer'
import homeUsers from './userReducer';
import userBlockReducer from './userBlcokReducer'
import roleReducer from './roleeReducer'
 import haramientaeReducer from './haramientasReducer'
import homePostsAprove from './posAprovetReducer'
import languageReducer from './languageReducer';
import reportReducer from './reportReducer'

 

export default combineReducers({
    auth,
    alert,
    theme,
    profile,
    status,
    homePosts,
    modal,
    detailPost,
    discover,
    suggestions,
    socket,
    notify,
    message,
    online,
    call,
    peer,homeUsers, userBlockReducer,roleReducer,haramientaeReducer, homePostsAprove,languageReducer, reportReducer

})