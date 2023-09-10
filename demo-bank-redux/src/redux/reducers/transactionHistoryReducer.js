import * as actionTypes from "../actions/actionTypes"
import initialState from "./initialState"

export default function transactionHistoryReducer(state=initialState.transactionHistory, action){
    switch(action.type){
        case actionTypes.GET_TRANSACTION_HISTORY_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}