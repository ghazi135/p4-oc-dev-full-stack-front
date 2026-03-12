/// <reference types="cypress" />

describe('Page Not Found', () => {
  it('affiche la page 404 pour une route inconnue', () => {
    // ACT : route qui n’existe pas
    cy.visit('/this-route-does-not-exist', { failOnStatusCode: false });

    // ASSERT : texte de NotFoundComponent
    cy.contains('h1', 'Page not found !').should('exist');
  });
});
