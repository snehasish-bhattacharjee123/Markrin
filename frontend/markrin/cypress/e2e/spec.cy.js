describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
});

it('Register', function() {
  cy.visit('http://localhost:5173/register')
  
  cy.get('#name').click();
  cy.get('#name').type('Jhon');
  cy.get('#email').click();
  cy.get('#email').type('jhon@gmail.com');
  cy.get('#password').click();
  cy.get('#password').type('123456789');
  cy.get('#root div.space-x-2').click();
  cy.get('#root label.text-xs').click();
  cy.get('#terms').check();
  cy.get('#root span.underline').click();
  cy.get('#terms').uncheck();
  cy.get('#root span.underline').click();
  cy.get('#terms').check();
  cy.get('#root span.underline').click();
  cy.get('#terms').uncheck();
  cy.get('#root span.underline').click();
  cy.get('#terms').check();
  cy.get('#root span.underline').click();
  cy.get('#terms').uncheck();
  cy.get('#root label.text-xs').click();
  cy.get('#terms').check();
  cy.get('#root button.w-full').click();
  cy.get('#email').click();
  cy.get('#email').clear();
  cy.get('#email').type('jhon1@gmail.com');
  cy.get('#root button.w-full').click();
  cy.get('#root nav.mx-auto > button:nth-child(1) > svg.w-6').click();
  
});