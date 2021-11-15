describe('Index', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show the loader message', () => {
    cy.findByText('Why Remix on Cloudflare Workers?', { exact: false }).should(
      'exist'
    );
  });
});
