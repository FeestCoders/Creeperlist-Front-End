import { JUST_VOTED, JUST_VOTED_CLEAR } from "../actionTypes";
import { HYDRATE } from "next-redux-wrapper";

const initialState = { justVoted: false };

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case HYDRATE:
        return state;
    case JUST_VOTED:
        return {...state, justVoted: true}
    case JUST_VOTED_CLEAR:
        return {...state, justVoted: false}
    default:
      return state;
  }
};

export default authReducer;
