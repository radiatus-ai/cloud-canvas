// First, install Cypress in your project
// Run this in your terminal:
// npm install cypress --save-dev

// Then, open Cypress to generate the initial folder structure:
// npx cypress open

// Create a new file in cypress/integration/login_spec.js

describe('Login Flow', () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('http://localhost:3000');

    cy.loginByGoogleApi();
  });

  it('should login successfully with Google Sign-In', () => {
    // // Mock the Google Sign-In response
    // const fakeOAuthResponse = {
    //   credential: 'fake_credential_token',
    // };

    // // Wait for the Google Sign-In button to be rendered
    // cy.get('iframe[src*="accounts.google.com"]', { timeout: 10000 }).should('be.visible');

    // // Use cy.origin to interact with the Google iframe content
    // cy.origin('https://accounts.google.com', () => {
    //   cy.get('div[role="button"]').should('be.visible').click();
    // });

    // // Trigger the Google Sign-In
    // cy.window().then((win) => {
    //   win.google.accounts.id.prompt.yields(fakeOAuthResponse);
    // });

    // // Assert that the prompt was called
    // cy.get('@googlePrompt').should('be.called');

    // // Wait for the login process to complete
    // cy.intercept('POST', 'https://auth.dev.r7ai.net/login/google').as('loginRequest');
    // cy.wait('@loginRequest');

    // Assert that we're redirected to the main page
    cy.url().should('eq', 'http://localhost:3000/');

    // Assert that the Projects component is visible
    cy.get('h1').should('contain', 'Projects');
  });

  // it('should show an error with invalid Google credentials', () => {
  //   // Mock an error response from the server
  //   cy.intercept('POST', 'https://auth.dev.r7ai.net/login/google', {
  //     statusCode: 401,
  //     body: { error: 'Invalid credentials' },
  //   }).as('loginRequest');

  //   // Trigger the Google Sign-In with an invalid token
  //   cy.window().then((win) => {
  //     win.google.accounts.id.prompt.yields({ credential: 'invalid_token' });
  //   });

  //   // Click the Google Sign-In button
  //   cy.get('button').contains('Sign in with Google').click();

  //   // Wait for the login request to complete
  //   cy.wait('@loginRequest');

  //   // Assert that we're still on the login page
  //   cy.url().should('eq', 'http://localhost:3000/');

  //   // Assert that an error message is shown (you may need to adjust this based on how errors are displayed in your app)
  //   cy.get('.MuiAlert-message').should('contain', 'Login failed');
  // });
});
