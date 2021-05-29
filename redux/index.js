import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import reducer from "./reducers";
import { createWrapper } from "next-redux-wrapper";
import Axios from "../axios";
import { config } from "@fortawesome/fontawesome-svg-core";


const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const interceptor = (store) => {
  Axios.interceptors.request.use(
      (conf) => {
          const state = store.getState();
 
          if(!conf.headers['Authorization'] && state.authReducer.token){

              conf.headers["Authorization"] = `Bearer ${state.authReducer.token}`
          }


          return conf;
      },
      (error) => {
          return Promise.reject(error);
      }
  );
};

let store = null;
const initStore = () => {
  store = createStore(reducer, bindMiddleware([thunkMiddleware]));
  interceptor(store);
  return store;
};

export const wrapper = createWrapper(initStore);

export default store;