describe('Project Creation', () => {
  beforeEach(() => {
    cy.loginByGoogleApi();
    cy.visit('http://localhost:3000');
  });

  it('should create a new project successfully', () => {
    cy.get('[data-cy="create-project-button"]').click();

    cy.get('[data-cy="project-name-input"]').type('Test Project');

    cy.get('[data-cy="create-project-submit"]').click();

    cy.get('[data-cy="project-list"]').should('contain', 'Test Project');

    cy.get('[data-cy="error-message"]').should('not.exist');
  });

  it('should display an error message when project creation fails', () => {
    cy.intercept('POST', '/api/projects', {
      statusCode: 500,
      body: { error: 'Server error' },
    }).as('createProject');

    cy.get('[data-cy="create-project-button"]').click();

    cy.get('[data-cy="project-name-input"]').type('Failed Project');

    cy.get('[data-cy="create-project-submit"]').click();

    cy.wait('@createProject');

    cy.get('[data-cy="error-message"]').should(
      'contain',
      'Failed to create project'
    );

    cy.get('[data-cy="project-list"]').should('not.contain', 'Failed Project');
  });
});
