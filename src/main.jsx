import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/common/Toast';
import PwaInstallBanner from './components/common/PwaInstallBanner';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import './styles/variables.css';
import './styles/global.css';
import './styles/components.css';
import './styles/templates.css';
import './styles/pwa.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
          <ToastContainer />
          <PwaInstallBanner />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Register service worker for Progressive Web App capabilities
serviceWorkerRegistration.register();
