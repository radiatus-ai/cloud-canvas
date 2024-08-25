import { GoogleOAuthProvider } from '@react-oauth/google';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { RecoilRoot } from 'recoil';
import App from './App';
import ErrorFallback from './components/ErrorFallback';
import { AuthProvider } from './contexts/Auth';
import { TitleProvider } from './contexts/TitleContext';
import './index.css';
import reportWebVitals from './reportWebVitals';
import ThemeContextProvider from './contexts/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
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
  </React.StrictMode>
);

reportWebVitals();
