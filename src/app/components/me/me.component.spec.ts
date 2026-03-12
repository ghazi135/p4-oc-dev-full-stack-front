import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { expect, jest } from '@jest/globals';

import { MeComponent } from './me.component';
import { SessionService } from 'src/app/core/service/session.service';
import { UserService } from 'src/app/core/service/user.service';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { User } from 'src/app/core/models/user.interface';

type SessionServiceMock = {
  sessionInformation: { id: number; admin: boolean };
  logOut: jest.Mock;
};

type UserServiceMock = {
  getById: jest.Mock;
  delete: jest.Mock;
};

type RouterMock = {
  navigate: jest.Mock;
};

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let sessionServiceMock: SessionServiceMock;
  let userServiceMock: UserServiceMock;
  let routerMock: RouterMock;

  beforeEach(async () => {
    const now = new Date();
    const mockUser: User = {
      id: 1,
      email: 'user@yoga.com',
      lastName: 'Doe',
      firstName: 'John',
      admin: false,
      password: 'Secret123',
      createdAt: now,
      updatedAt: now,
    };

    sessionServiceMock = {
      sessionInformation: { id: 1, admin: false },
      logOut: jest.fn(),
    };

    userServiceMock = {
      getById: jest.fn().mockReturnValue(of(mockUser)),
      delete: jest.fn().mockReturnValue(of(void 0)),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MeComponent, BrowserAnimationsModule],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Arrange + Act
    // (tout est déjà fait dans le beforeEach)

    // Assert
    expect(component).toBeTruthy();
  });

  it('ngOnInit() doit charger l\'utilisateur courant', () => {
    // Arrange
    // (initialisation déjà faite)

    // Act
    // (ngOnInit déjà appelé par detectChanges)

    // Assert
    expect(userServiceMock.getById).toHaveBeenCalledWith('1');
    expect(component.user).toBeDefined();
    expect(component.user?.email).toBe('user@yoga.com');
  });

  it('delete() doit supprimer le compte, afficher un snackBar, déconnecter et navigue à la racine', () => {
    // Arrange
    const snackBar = fixture.debugElement.injector.get(MatSnackBar);
    const openSpy = jest
      .spyOn(snackBar, 'open')
      .mockReturnValue({} as MatSnackBarRef<TextOnlySnackBar>);

    // Act
    component.delete();

    // Assert
    expect(userServiceMock.delete).toHaveBeenCalledWith('1');
    expect(openSpy).toHaveBeenCalledWith(
      'Your account has been deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(sessionServiceMock.logOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('back() doit appeler history.back()', () => {
    // Arrange
    const historyBackSpy = jest
      .spyOn(globalThis.history, 'back')
      .mockImplementation(() => undefined);

    // Act
    component.back();

    // Assert
    expect(historyBackSpy).toHaveBeenCalled();

    historyBackSpy.mockRestore();
  });
});
