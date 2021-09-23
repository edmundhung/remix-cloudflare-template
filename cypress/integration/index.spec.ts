describe('Index', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show the loader message', () => {
    cy.findByText('this is awesome 😎', { exact: false }).should('exist');
  });
});
