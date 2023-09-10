import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/root/App";
import reportWebVitals from "./reportWebVitals";
import "alertifyjs/build/css/alertify.min.css";
import { Provider } from "react-redux";
import configureStore from "./redux/reducers/configureStore"


const root = ReactDOM.createRoot(document.getElementById("root"));

const store = configureStore();

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();
