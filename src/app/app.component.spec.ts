import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { expect, jest } from '@jest/globals';

import { AppComponent } from './app.component';
import { SessionService } from './core/service/session.service';
import { AuthService } from './core/service/auth.service';

type SessionServiceMock = {
  $isLogged: jest.Mock;
  logOut: jest.Mock;
};

type RouterMock = {
  navigate: jest.Mock;
};

describe('AppComponent', () => {
  let sessionServiceMock: SessionServiceMock;
  let routerMock: RouterMock;

  beforeEach(async () => {
    sessionServiceMock = {
      $isLogged: jest.fn().mockReturnValue(of(true)),
      logOut: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: AuthService, useValue: {} },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    // Arrange
    const fixture = TestBed.createComponent(AppComponent);

    // Act
    const app = fixture.componentInstance;

    // Assert
    expect(app).toBeTruthy();
  });

  it('logout() doit appeler SessionService.logOut et router.navigate vers la racine', () => {
    // Arrange
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    // Act
    app.logout();

    // Assert
    expect(sessionServiceMock.logOut).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });
});
