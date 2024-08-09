import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StateProvider from "./context/StateContext";
import axios from "axios";

const SERVER_URL = "";
// const SERVER_URL = "https://csi-certificate-validator-api.vercel.app";

axios.defaults.baseURL = SERVER_URL;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StateProvider>
      <App />
    </StateProvider>
  </React.StrictMode>
);
