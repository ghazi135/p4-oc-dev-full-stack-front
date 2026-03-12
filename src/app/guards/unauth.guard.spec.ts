import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { expect, jest } from '@jest/globals';

import { UnauthGuard } from './unauth.guard';
import { SessionService } from '../core/service/session.service';

describe('UnauthGuard', () => {
  let guard: UnauthGuard;
  let routerNavigateMock: jest.Mock;
  let sessionServiceMock: Partial<SessionService>;

  beforeEach(() => {
    routerNavigateMock = jest.fn();
    sessionServiceMock = { isLogged: false };

    TestBed.configureTestingModule({
      providers: [
        UnauthGuard,
        { provide: Router, useValue: { navigate: routerNavigateMock } },
        { provide: SessionService, useValue: sessionServiceMock },
      ],
    });

    guard = TestBed.inject(UnauthGuard);
  });

  it("doit laisser passer si l'utilisateur n'est pas connecté", () => {
    // Arrange
    sessionServiceMock.isLogged = false;

    // Act
    const result = guard.canActivate();

    // Assert
    expect(result).toBe(true);
    expect(routerNavigateMock).not.toHaveBeenCalled();
  });

  it("doit rediriger et retourner false si l'utilisateur est déjà connecté", () => {
    // Arrange
    sessionServiceMock.isLogged = true;

    // Act
    const result = guard.canActivate();

    // Assert
    expect(result).toBe(false);
    expect(routerNavigateMock).toHaveBeenCalledWith(['rentals']);
  });
});
