import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { expect, jest } from '@jest/globals';

import { AuthGuard } from './auth.guard';
import { SessionService } from '../core/service/session.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerNavigateMock: jest.Mock;
  let sessionServiceMock: Partial<SessionService>;

  beforeEach(() => {
    routerNavigateMock = jest.fn();
    sessionServiceMock = { isLogged: false };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: { navigate: routerNavigateMock } },
        { provide: SessionService, useValue: sessionServiceMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it("doit rediriger vers 'login' et retourner false si l'utilisateur n'est pas connecté", () => {
    // Arrange
    sessionServiceMock.isLogged = false;

    // Act
    const result = guard.canActivate();

    // Assert
    expect(result).toBe(false);
    expect(routerNavigateMock).toHaveBeenCalledWith(['login']);
  });

  it("doit laisser passer et ne pas rediriger si l'utilisateur est connecté", () => {
    // Arrange
    sessionServiceMock.isLogged = true;

    // Act
    const result = guard.canActivate();

    // Assert
    expect(result).toBe(true);
    expect(routerNavigateMock).not.toHaveBeenCalled();
  });
});
