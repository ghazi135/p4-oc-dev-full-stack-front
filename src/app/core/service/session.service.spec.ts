import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../models/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('doit être créé', () => {
    // Arrange
    // (Le service est injecté en beforeEach)

    // Act
    // (rien à faire)

    // Assert
    expect(service).toBeTruthy();
  });

  it('$isLogged() doit émettre false initialement', (done) => {
    // Arrange
    // (service déjà injecté)

    // Act
    service.$isLogged().subscribe((value) => {
      // Assert
      expect(value).toBe(false);
      done();
    });
  });

  it('logIn() et logOut() doivent mettre à jour isLogged, sessionInformation et le flux $isLogged()', () => {
    // Arrange
    const info: SessionInformation = {
      token: 'token-123',
      type: 'Bearer',
      id: 1,
      username: 'user@yoga.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
    };
    const emissions: boolean[] = [];

    service.$isLogged().subscribe((v) => emissions.push(v));

    // Act
    service.logIn(info);
    service.logOut();

    // Assert
    expect(emissions).toEqual([false, true, false]);
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });
});
