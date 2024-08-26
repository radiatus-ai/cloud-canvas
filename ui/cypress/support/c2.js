// cypress/support/commands.js
Cypress.Commands.add('loginByGoogleApi', () => {
  cy.log('Logging in to Google');
  cy.request({
    method: 'POST',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    body: {
      grant_type: 'refresh_token',
      client_id: Cypress.env('googleClientId'),
      client_secret: Cypress.env('googleClientSecret'),
      refresh_token: Cypress.env('googleRefreshToken'),
    },
  }).then(({ body }) => {
    const { id_token } = body;

    // Simulate backend login process
    cy.request({
      method: 'POST',
      url: '/auth/login/google', // Adjust this to your actual backend endpoint
      body: { token: id_token },
    }).then(({ body }) => {
      const userData = {
        token: body.token,
        user: {
          id: body.user.id,
          email: body.user.email,
          googleId: body.user.googleId,
          // Add any other user properties returned by your backend
        },
        organizationId: body.organizationId,
      };

      // Base64 encode the userData before storing it
      const encodedUserData = btoa(JSON.stringify(userData));
      window.localStorage.setItem('userData', encodedUserData);
      cy.reload();
    });
  });
});
