import React from "react";
import ReactDOM from "react-dom/client";
import "./index.module.css";
import App from "./app";
import { Provider } from "react-redux";
import store from "./store/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
