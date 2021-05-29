import flatCombineReducers from "flat-combine-reducers";
import { combineReducers } from "redux";

import authReducer from "./auth";
import globalReducer from "./global";

const rootReducer = combineReducers({ authReducer, globalReducer });

export default rootReducer;
