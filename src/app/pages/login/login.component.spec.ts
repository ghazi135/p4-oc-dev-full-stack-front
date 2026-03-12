import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { expect, jest } from '@jest/globals';

import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/core/service/auth.service';
import { SessionService } from 'src/app/core/service/session.service';
import { SessionInformation } from 'src/app/core/models/sessionInformation.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: { login: jest.Mock };
  let sessionServiceMock: { logIn: jest.Mock };
  let routerMock: { navigate: jest.Mock };

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
    };

    sessionServiceMock = {
      logIn: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submit() doit appeler authService.login, SessionService.logIn et naviguer vers /sessions en cas de succès', () => {
    const mockSession: SessionInformation = {
      token: 'token-123',
      type: 'Bearer',
      id: 1,
      username: 'user@yoga.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
    };

    authServiceMock.login.mockReturnValue(of(mockSession));

    component.form.setValue({
      email: 'user@yoga.com',
      password: 'Secret123',
    });

    component.submit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'user@yoga.com',
      password: 'Secret123',
    });
    expect(sessionServiceMock.logIn).toHaveBeenCalledWith(mockSession);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
    expect(component.onError).toBe(false);
  });

  it('submit() doit mettre onError à true en cas d\'erreur', () => {
    authServiceMock.login.mockReturnValue(
      throwError(() => new Error('Bad credentials'))
    );

    component.form.setValue({
      email: 'user@yoga.com',
      password: 'wrong',
    });

    component.submit();

    expect(component.onError).toBe(true);
    expect(sessionServiceMock.logIn).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
