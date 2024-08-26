describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should login successfully with Google', () => {
    cy.loginByGoogleApi();
    cy.url().should('eq', 'http://localhost:3000/');
    cy.get('h1').should('contain', 'Projects');
  });

  it('should persist login across page reloads', () => {
    cy.loginByGoogleApi();
    cy.reload();
    cy.url().should('eq', 'http://localhost:3000/');
    cy.get('h1').should('contain', 'Projects');
  });

  it('should logout successfully', () => {
    cy.loginByGoogleApi();
    cy.get('[data-cy="logout-button"]').click();
    cy.url().should('eq', 'http://localhost:3000/login');
  });

  it('should redirect to login page when accessing protected route without authentication', () => {
    cy.visit('/projects');
    cy.url().should('eq', 'http://localhost:3000/login');
  });

  it('should display error message for invalid token', () => {
    window.localStorage.setItem('authToken', 'invalid_token');
    cy.visit('/projects');
    cy.get('[data-cy="error-message"]').should('contain', 'Invalid token');
  });
});
