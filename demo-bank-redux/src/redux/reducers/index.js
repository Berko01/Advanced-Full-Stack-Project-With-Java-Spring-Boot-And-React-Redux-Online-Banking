import { combineReducers } from "redux";
import changeAccountReducer from "./changeAccountReducer";
import accountListReducer from "./accountListReducer";
import totalBalanceReducer from "./totalBalanceReducer";
import transactionHistoryReducer from "./transactionHistoryReducer";

const rootReducer = combineReducers({
  changeAccountReducer,
  accountListReducer,
  totalBalanceReducer,
  transactionHistoryReducer
});

export default rootReducer;
