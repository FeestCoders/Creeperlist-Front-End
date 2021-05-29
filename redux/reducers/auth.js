import { AUTHENTICATE, DEAUTHENTICATE, AUTHENTICATE_FAIL, LOGIN_START, LOGIN_END } from "../actionTypes";
import { HYDRATE } from "next-redux-wrapper";

const initialState = { token: null, error: null, loggingIn: false };

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return {...state, ...action.payload['authReducer']};
    case AUTHENTICATE:
      return { ...state, token: action.payload };
    case LOGIN_START:
      return {...state, loggingIn: true};
    case LOGIN_END:
      return {...state, loggingIn: false};
    case AUTHENTICATE_FAIL:
      return {...state, error: action.payload};
    case DEAUTHENTICATE:
      return { token: null };
    default:
      return state;
  }
};

export default authReducer;
