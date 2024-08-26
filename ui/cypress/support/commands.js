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
    const { access_token, id_token } = body;

    cy.request({
      method: 'GET',
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      headers: { Authorization: `Bearer ${access_token}` },
    }).then(({ body }) => {
      cy.log(body);
      const userItem = {
        token: id_token,
        user: {
          googleId: body.sub,
          email: body.email,
          givenName: body.given_name,
          familyName: body.family_name,
          imageUrl: body.picture,
        },
      };

      // Send the Google token to your backend
      cy.request({
        method: 'POST',
        url: 'https://auth-service-razsp32k5q-uc.a.run.app/login/google',
        body: { token: id_token },
      }).then((response) => {
        expect(response.status).to.eq(200);
        const { token, user } = response.body;

        // Store the token from your backend
        window.localStorage.setItem('authToken', token);

        // Store user info if needed
        window.localStorage.setItem('user', JSON.stringify(user));

        cy.log('Logged in successfully');
      });
    });
  });
});
