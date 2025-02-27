
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { UserProvider } from './context/UserContext';
import { GoogleMapsProvider } from './context/GoogleMapsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <GoogleMapsProvider>
        <App />
      </GoogleMapsProvider>
    </UserProvider>
  </React.StrictMode>
);
