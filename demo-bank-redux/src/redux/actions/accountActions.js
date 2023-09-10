import * as actionTypes from "./actionTypes";
import axios from "axios";

export function changeAccount(account) {
  return { type: actionTypes.CHANGE_ACCOUNT, payload: account };
}

export function getAccountsSuccess(accounts) {
  return { type: actionTypes.GET_ACCOUNTS_SUCCESS, payload: accounts };
}

export function getTotalBalanceSuccess(balance){
  return {type: actionTypes.GET_TOTAL_BALANCE_SUCCESS, payload: balance}
}

export function getTransactionHistorySuccess(history){
  return {type: actionTypes.GET_TRANSACTION_HISTORY_SUCCESS, payload: history}
}

export function getAccounts() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo.access_token;

  return function (dispatch) {
    const apiUrl = "http://127.0.0.1:8070/app/dashboard";
    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer: " + accessToken,
        },
      })
      .then((response) =>
        dispatch(getAccountsSuccess(response.data.userAccounts))
      )
      .catch((error) => {
        console.error(error);
      });
  };

}

export function getTotalBalance(){

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo.access_token;

  return function (dispatch) {
    const apiUrl = "http://127.0.0.1:8070/app/dashboard";
    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer: " + accessToken,
        },
      })
      .then((response) =>
        dispatch(getTotalBalanceSuccess(response.data.totalBalance))
      )
      .catch((error) => {
        console.error(error);
      });
  };

}

export function getTransactionHistory() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = userInfo.access_token;

  


  return function (dispatch) {
    const apiUrl = "http://127.0.0.1:8070/app/transaction_history";
    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer: " + accessToken,
        },
      })
      .then((response) =>
        dispatch(getTransactionHistorySuccess(response.data.transaction_history))
      )
      .catch((error) => {
        console.error(error);
      });



};}




