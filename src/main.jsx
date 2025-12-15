import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { basePath } from './context/constants';
import { BrowserRouter } from 'react-router-dom';
import './i18n';
createRoot(document.getElementById('root')).render(<StrictMode>
    <BrowserRouter basename={basePath}>
      <App />
    </BrowserRouter>
  </StrictMode>);