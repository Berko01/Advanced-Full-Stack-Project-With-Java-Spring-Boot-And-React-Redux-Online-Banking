import * as actionTypes from "../actions/actionTypes"
import initialState from "./initialState"

export default function changeAccountReducer(state=initialState.currentAccount, action){
    switch(action.type){
        case actionTypes.CHANGE_ACCOUNT:
            return action.payload;
        default:
            return state;
    }
}