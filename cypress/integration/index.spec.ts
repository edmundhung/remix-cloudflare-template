describe('Index', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show the package name', () => {
    cy.findAllByText('remix-worker-template', { exact: false }).should('exist');
  });
});
