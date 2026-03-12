/// <reference types="cypress" />

describe('Plan P4 - Authentification (login, register, logout)', () => {
  // Helper simple pour éviter de répéter les lignes à chaque test de login
  const doLoginAsAdmin = () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-token',
        type: 'Bearer',
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    }).as('login');

    cy.intercept('GET', '**/api/session', {
      statusCode: 200,
      body: [],
    }).as('sessions');

    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');
    cy.get('form.login-form').submit();

    cy.wait('@login');
    cy.wait('@sessions');
    cy.url().should('include', '/sessions');
  };

  it('connecte l’utilisateur avec des identifiants valides', () => {
    // ARRANGE + ACT + ASSERT via helper
    doLoginAsAdmin();
  });

  it('affiche un message d’erreur quand la connexion échoue', () => {
    // ===== ARRANGE =====
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 401,
      body: { message: 'Bad credentials' },
    }).as('loginError');

    // ===== ACT =====
    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('wrong');
    cy.get('form.login-form').submit();

    // ===== ASSERT =====
    cy.wait('@loginError');
    cy.get('.error').should('contain.text', 'An error occurred');
  });

  it('crée un compte puis redirige vers l’écran de connexion', () => {
    // ===== ARRANGE =====
    cy.intercept('POST', '**/api/auth/register', {
      statusCode: 201,
      body: {},
    }).as('register');

    // ===== ACT =====
    cy.visit('/register');
    cy.get('input[formControlName="firstName"]').type('John');
    cy.get('input[formControlName="lastName"]').type('Doe');
    cy.get('input[formControlName="email"]').type('user@yoga.com');
    cy.get('input[formControlName="password"]').type('Secret123');
    cy.get('form.register-form').submit();

    // ===== ASSERT =====
    cy.wait('@register');
    cy.url().should('include', '/login');
  });

  it('affiche un message d’erreur quand la création de compte échoue', () => {
    // ===== ARRANGE =====
    cy.intercept('POST', '**/api/auth/register', {
      statusCode: 400,
      body: { message: 'Registration error' },
    }).as('registerError');

    // ===== ACT =====
    cy.visit('/register');
    cy.get('input[formControlName="firstName"]').type('John');
    cy.get('input[formControlName="lastName"]').type('Doe');
    cy.get('input[formControlName="email"]').type('user@yoga.com');
    cy.get('input[formControlName="password"]').type('Secret123');
    cy.get('form.register-form').submit();

    // ===== ASSERT =====
    cy.wait('@registerError');
    cy.get('.error').should('contain.text', 'An error occurred');
  });

  it('déconnecte l’utilisateur via la toolbar et ré‑affiche les liens Login/Register', () => {
    // ===== ARRANGE + ACT : login =====
    doLoginAsAdmin();

    // ===== ASSERT : liens visibles quand connecté =====
    cy.contains('span.link', 'Sessions').should('exist');
    cy.contains('span.link', 'Account').should('exist');
    cy.contains('span.link', 'Logout').should('exist');

    // ===== ACT : logout =====
    cy.contains('span.link', 'Logout').click();

    // ===== ASSERT : liens non connecté =====
    cy.contains('a.link', 'Login').should('exist');
    cy.contains('a.link', 'Register').should('exist');
  });

  it('désactive le bouton Register tant que le formulaire est incomplet ou invalide', () => {
    // ===== ARRANGE =====
    cy.visit('/register');

    // ===== ASSERT initial : form invalid => submit disabled =====
    cy.get('button[type="submit"]').should('be.disabled');

    // ===== ACT : firstName trop court =====
    cy.get('input[formControlName="firstName"]').type('Jo');
    cy.get('button[type="submit"]').should('be.disabled');

    // ===== ACT : form valide =====
    cy.get('input[formControlName="firstName"]').clear().type('John');
    cy.get('input[formControlName="lastName"]').type('Doe');
    cy.get('input[formControlName="email"]').type('user@yoga.com');
    cy.get('input[formControlName="password"]').type('Secret123');

    // ===== ASSERT final =====
    cy.get('button[type="submit"]').should('not.be.disabled');
  });
});
