import { GoogleOAuthProvider } from '@react-oauth/google';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { RecoilRoot } from 'recoil';
import App from './App';
import ErrorFallback from './components/ErrorFallback';
import { AuthProvider } from './contexts/Auth';
import ThemeContextProvider from './contexts/ThemeContext';
import { TitleProvider } from './contexts/TitleContext';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React>
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => {
      // For example, you could clear local storage, reset global state, etc.
      localStorage.clear();
      window.location.href = '/'; // Redirect to home page
    }}
    onError={(error, errorInfo) => {
      // Log the error to an error reporting service
      console.error('Caught an error:', error, errorInfo);
      // You could also send this to a service like Sentry or LogRocket
    }}
  >
    <RecoilRoot>
      <ThemeContextProvider>
        <GoogleOAuthProvider clientId="1018921851541-kja9q7h1e3f1ah00c1v0pifu9n3mqbj8.apps.googleusercontent.com">
          <AuthProvider>
            <SnackbarProvider>
              <TitleProvider>
                <App />
              </TitleProvider>
            </SnackbarProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </ThemeContextProvider>
    </RecoilRoot>
  </ErrorBoundary>
  // </React>
);

reportWebVitals();
