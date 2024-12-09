import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { Auth0Provider } from "@auth0/auth0-react";
import { PersistGate } from "redux-persist/integration/react";
// import store from './store/store.ts'
import store, { persistor } from "./store/store.ts";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer} from 'react-toastify'
import './i18n.js'; 

// const LoadingSpinner = () => (
//   <Box
//     sx={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       height: "100vh",
//     }}
//   >
//     <CircularProgress />
//   </Box>
// );

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider // The app is wrapped around Auth0
     // domain="dev-2ryleqq3rcifjgv3.us.auth0.com" // Auth0's domain
     //clientId="74JFw8RMEMLDVkxYVtwpgESraiySvNHT" // Auth0 client id for this specific app
     domain ="dev-ktpo26kfzjjxf0ed.us.auth0.com"
     clientId="L9byDsePXEfa0owHw2Q4KejZlImcvtDz"
     
      authorizationParams={{
        redirect_uri: window.location.origin + "/home" // An authorized user will be redirected to the home page
      }}
      
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        <App />
        <ToastContainer position='top-center' />
        </PersistGate>
      </Provider>
    </Auth0Provider>
  </React.StrictMode>,
);
