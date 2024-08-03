import React, { useEffect, useRef } from 'react';

const GoogleSignIn = ({ onSuccess, onError }) => {
  const googleButtonRef = useRef(null);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
        });
      } else {
        setTimeout(initializeGoogleSignIn, 100);
      }
    };

    initializeGoogleSignIn();
  }, []);

  const handleCredentialResponse = (response) => {
    if (response.credential) {
      // Use the id_token for authentication
      const idToken = response.credential;
      onSuccess(idToken);
    } else {
      onError('No credential received');
    }
  };

  return <div ref={googleButtonRef}></div>;
};

export default GoogleSignIn;
