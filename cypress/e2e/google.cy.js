describe('Teste simples', () => {

  it('abre o google', () => {

    cy.visit('https://google.com')

    cy.contains('Google')

  })

})