import * as actionTypes from "../actions/actionTypes"
import initialState from "./initialState"

export default function accountListReducer(state=initialState.accounts, action){
    switch(action.type){
        case actionTypes.GET_ACCOUNTS_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}