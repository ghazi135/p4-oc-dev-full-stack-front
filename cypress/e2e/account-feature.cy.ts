/// <reference types="cypress" />

describe('Plan P4 - Account (utilisateur non admin)', () => {
  const mockUser = {
    id: 1,
    email: 'user@yoga.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: false,
    password: 'Secret123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockSessionInfo = {
    token: 'token-123',
    type: 'Bearer',
    id: 1,
    username: 'user@yoga.com',
    firstName: 'John',
    lastName: 'Doe',
    admin: false,
  };

  beforeEach(() => {
    // ===== ARRANGE (mocks réseau) =====
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: mockSessionInfo,
    }).as('login');

    cy.intercept('GET', '**/api/session', {
      statusCode: 200,
      body: [],
    }).as('sessions');

    cy.intercept('GET', '**/api/user/1', {
      statusCode: 200,
      body: mockUser,
    }).as('getMe');

    // ===== ACT (login) =====
    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('user@yoga.com');
    cy.get('input[formControlName="password"]').type('Secret123');
    cy.get('form.login-form').submit();

    // ===== ASSERT (login ok + arrivée) =====
    cy.wait('@login');
    cy.wait('@sessions');
    cy.url().should('include', '/sessions');
  });

  it('affiche les informations du compte et permet à l’utilisateur de supprimer son profil', () => {
    // ===== ACT : on va sur la page Account =====
    cy.contains('span.link', 'Account').click();
    cy.wait('@getMe');

    // ===== ASSERT : infos visibles =====
    cy.contains('p', 'Name: John DOE').should('exist');
    cy.contains('p', 'Email: user@yoga.com').should('exist');

    // ===== ARRANGE : mock suppression =====
    cy.intercept('DELETE', '**/api/user/1', {
      statusCode: 200,
      body: {},
    }).as('deleteUser');

    // ===== ACT : clic sur "Delete my account" =====
    cy.contains('button span', 'Detail').click();

    // ===== ASSERT : DELETE appelé + redirect "/" =====
    cy.wait('@deleteUser');
    cy.url().should('include', '/');
  });

  it('permet de revenir à la liste des sessions depuis la page de compte', () => {
    // ===== ACT : aller sur Account =====
    cy.contains('span.link', 'Account').click();
    cy.wait('@getMe');

    // ===== ASSERT intermédiaire =====
    cy.contains('p', 'Email: user@yoga.com').should('exist');

    // ===== ACT : clic sur la flèche back (history.back()) =====
    cy.get('button[mat-icon-button]').first().click();

    // ===== ASSERT : retour /sessions =====
    cy.url().should('include', '/sessions');
  });
});

describe('Plan P4 - Account (administrateur)', () => {
  const mockAdminUser = {
    id: 1,
    email: 'admin@yoga.com',
    lastName: 'Admin',
    firstName: 'Admin',
    admin: true,
    password: 'Secret123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockAdminSessionInfo = {
    token: 'token-admin',
    type: 'Bearer',
    id: 1,
    username: 'admin@yoga.com',
    firstName: 'Admin',
    lastName: 'Admin',
    admin: true,
  };

  beforeEach(() => {
    // ===== ARRANGE (mocks réseau) =====
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: mockAdminSessionInfo,
    }).as('loginAdmin');

    // après login => navigation /sessions => GET /api/session
    cy.intercept('GET', '**/api/session', {
      statusCode: 200,
      body: [],
    }).as('sessions');

    cy.intercept('GET', '**/api/user/1', {
      statusCode: 200,
      body: mockAdminUser,
    }).as('getMeAdmin');

    // ===== ACT (login) =====
    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('admin@yoga.com');
    cy.get('input[formControlName="password"]').type('Secret123');
    cy.get('form.login-form').submit();

    // ===== ASSERT =====
    cy.wait('@loginAdmin');
    cy.wait('@sessions');
    cy.url().should('include', '/sessions');
  });

  it('affiche un message dédié pour un compte administrateur et masque la suppression de compte', () => {
    // ===== ACT : aller sur Account =====
    cy.contains('span.link', 'Account').click();
    cy.wait('@getMeAdmin');

    // ===== ASSERT : branche user.admin du template =====
    cy.contains('p.my2', 'You are admin').should('exist');
    cy.contains('p', 'Delete my account:').should('not.exist');
  });
});
