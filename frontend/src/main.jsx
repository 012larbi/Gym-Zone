import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Move client ID to env variable — don't hardcode credentials in source
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '361002516636-ion4bf4nttqtbk4tq4vbn29gjkf9fv8g.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);
