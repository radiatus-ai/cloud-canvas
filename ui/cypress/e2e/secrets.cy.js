describe('Secret Creation', () => {
    beforeEach(() => {
      // Visit the main page and log in before each test
      cy.visit('http://localhost:3000');
      cy.loginByGoogleApi();
      cy.visit('http://localhost:3000/secrets');
    });

    it('should create a new secret successfully', () => {
      // Click on the "Create Project" button
      cy.contains('button', 'Create Secret').click();

      // Wait for the modal to appear
    //   cy.get('div[role="dialog"]').should('be.visible');

    //   // Fill in the project name
    //   cy.get('label')
    //     .contains('Project Name')
    //     .parent()
    //     .find('input[type="text"]')
    //     .type('Test Project');

    //   // Submit the form using the button with id "create-project-button"
    //   cy.get('#create-project-button').click();

    //   // Assert that the modal is closed
    //   cy.get('div[role="dialog"]').should('not.exist');

    //   // Assert that the new project is created and visible
    //   cy.contains('h2', 'Test Project').should('be.visible');

    //   // Assert that no error message is shown
    //   cy.contains('Failed to create project').should('not.exist');
    });
  });
