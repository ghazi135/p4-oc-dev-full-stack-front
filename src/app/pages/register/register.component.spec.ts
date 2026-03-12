import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { expect, jest } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { AuthService } from 'src/app/core/service/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: { register: jest.Mock };
  let routerMock: { navigate: jest.Mock };

  beforeEach(async () => {
    authServiceMock = {
      register: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submit() doit appeler authService.register et naviguer vers /login en cas de succès', () => {
    authServiceMock.register.mockReturnValue(of(void 0));

    component.form.setValue({
      email: 'user@yoga.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'Secret123',
    });

    component.submit();

    expect(authServiceMock.register).toHaveBeenCalledWith({
      email: 'user@yoga.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'Secret123',
    });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.onError).toBe(false);
  });

  it('submit() doit mettre onError à true en cas d\'erreur', () => {
    authServiceMock.register.mockReturnValue(
      throwError(() => new Error('Registration error'))
    );

    component.form.setValue({
      email: 'user@yoga.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'Secret123',
    });

    component.submit();

    expect(component.onError).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
