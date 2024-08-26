describe('Secret Creation', () => {
  beforeEach(() => {
    cy.loginByGoogleApi();
    cy.visit('http://localhost:3000/secrets');
  });

  it('should create a new secret successfully', () => {
    cy.get('[data-cy="create-secret-button"]').click();
    cy.get('[data-cy="credential-name-input"]').type('Test Secret');
    cy.get('[data-cy="credential-type-input"]')
      .parent()
      .click()
      .get('ul > li[data-value="SERVICE_ACCOUNT_KEY"]')
      .click();
    cy.get('[data-cy="credential-value-input"]').type('Test Value');
    cy.get('[data-cy="submit-secret-button"]').click();

    cy.get('[data-cy="secrets-list"]').should('contain', 'Test Secret');
    cy.get('[data-cy="error-message"]').should('not.exist');
  });

  it('should display an error message when secret creation fails', () => {
    cy.intercept('POST', '/api/secrets', {
      statusCode: 500,
      body: { error: 'Server error' },
    }).as('createSecret');

    cy.get('[data-cy="create-secret-button"]').click();
    cy.get('[data-cy="credential-name-input"]').type('Failed Secret');
    cy.get('[data-cy="credential-type-input"]')
      .parent()
      .click()
      .get('ul > li[data-value="SERVICE_ACCOUNT_KEY"]')
      .click();
    cy.get('[data-cy="credential-value-input"]').type('Test Value');
    cy.get('[data-cy="submit-secret-button"]').click();

    cy.wait('@createSecret');

    cy.get('[data-cy="error-message"]').should(
      'contain',
      'Failed to create secret'
    );
    cy.get('[data-cy="secrets-list"]').should('not.contain', 'Failed Secret');
  });
});
