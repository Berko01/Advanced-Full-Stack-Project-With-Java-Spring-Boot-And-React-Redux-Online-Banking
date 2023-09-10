import * as actionTypes from "../actions/actionTypes"
import initialState from "./initialState"

export default function totalBalanceReducer(state=initialState.totalBalance, action){
    switch(action.type){
        case actionTypes.GET_TOTAL_BALANCE_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}