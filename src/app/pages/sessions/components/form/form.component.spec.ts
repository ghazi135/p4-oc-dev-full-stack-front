import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { expect, jest } from '@jest/globals';

import { FormComponent } from './form.component';
import { SessionApiService } from 'src/app/core/service/session-api.service';
import { SessionService } from 'src/app/core/service/session.service';
import { TeacherService } from 'src/app/core/service/teacher.service';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Session } from 'src/app/core/models/session.interface';
import { SessionInformation } from 'src/app/core/models/sessionInformation.interface';

type SessionApiServiceMock = {
  detail: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
};

type SessionServiceMock = {
  sessionInformation: SessionInformation;
};

type TeacherServiceMock = {
  all: jest.Mock;
};

type RouterMock = {
  navigate: jest.Mock;
  url: string;
};

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  let sessionApiServiceMock: SessionApiServiceMock;
  let sessionServiceMock: SessionServiceMock;
  let teacherServiceMock: TeacherServiceMock;
  let routerMock: RouterMock;

  beforeEach(async () => {
    const mockSession: Session = {
      id: 1,
      name: 'Yoga doux',
      description: 'Relax',
      date: new Date(),
      teacher_id: 4,
      users: [],
    };

    const mockUser: SessionInformation = {
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'admin@yoga.com',
      firstName: 'Admin',
      lastName: 'Admin',
      admin: true,
    };

    sessionApiServiceMock = {
      detail: jest.fn().mockReturnValue(of(mockSession)),
      create: jest.fn().mockReturnValue(of(mockSession)),
      update: jest.fn().mockReturnValue(of(mockSession)),
    };

    sessionServiceMock = {
      sessionInformation: mockUser,
    };

    teacherServiceMock = {
      all: jest.fn().mockReturnValue(of([])),
    };

    routerMock = {
      navigate: jest.fn(),
      url: '/sessions/create',
    };

    await TestBed.configureTestingModule({
      imports: [FormComponent, BrowserAnimationsModule, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: SessionApiService, useValue: sessionApiServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit
  });

  it('should create', () => {
    // Arrange + Act
    // (fait dans beforeEach)

    // Assert
    expect(component).toBeTruthy();
  });

  it("ngOnInit() doit rediriger vers /sessions si l'utilisateur n'est pas admin", () => {
    // Arrange
    sessionServiceMock.sessionInformation.admin = false;

    // On recrée le composant pour rejouer ngOnInit avec admin = false
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;

    // Act
    fixture.detectChanges();

    // Assert
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('ngOnInit() en mode création ne doit pas appeler SessionApiService.detail', () => {
    // Arrange : on force l’URL en mode création
    routerMock.url = '/sessions/create';

    // On recrée le composant pour prendre en compte la nouvelle URL
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;

    // Act
    fixture.detectChanges();

    // Assert
    expect(sessionApiServiceMock.detail).not.toHaveBeenCalled();
    expect(component.onUpdate).toBe(false);
    expect(component.sessionForm).toBeDefined();
  });

  it('ngOnInit() en mode update doit appeler SessionApiService.detail et remplir le formulaire', () => {
    // Arrange : on force l’URL en mode update
    routerMock.url = '/sessions/update/1';

    // On recrée le composant
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;

    // Act
    fixture.detectChanges();

    // Assert
    expect(sessionApiServiceMock.detail).toHaveBeenCalledWith('1');
    expect(component.onUpdate).toBe(true);
    expect(component.sessionForm?.get('name')?.value).toBe('Yoga doux');
  });

  it('submit() en création doit appeler create() et naviguer vers /sessions', () => {
    // Arrange : mode création
    component.onUpdate = false;
    component.sessionForm?.setValue({
      name: 'New session',
      date: '2025-01-01',
      teacher_id: 4,
      description: 'Desc',
    });

    const snackBar = fixture.debugElement.injector.get(MatSnackBar);
    const openSpy = jest
      .spyOn(snackBar, 'open')
      .mockReturnValue({} as MatSnackBarRef<TextOnlySnackBar>);

    // Act
    component.submit();

    // Assert
    expect(sessionApiServiceMock.create).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith('Session created !', 'Close', {
      duration: 3000,
    });
    expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('submit() en update doit appeler update() et naviguer vers /sessions', () => {
    // Arrange : mode update
    routerMock.url = '/sessions/update/1';
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.sessionForm?.setValue({
      name: 'Updated session',
      date: '2025-01-01',
      teacher_id: 4,
      description: 'Updated desc',
    });

    const snackBar = fixture.debugElement.injector.get(MatSnackBar);
    const openSpy = jest
      .spyOn(snackBar, 'open')
      .mockReturnValue({} as MatSnackBarRef<TextOnlySnackBar>);

    // Act
    component.submit();

    // Assert
    expect(sessionApiServiceMock.update).toHaveBeenCalledWith('1', {
      name: 'Updated session',
      date: '2025-01-01',
      teacher_id: 4,
      description: 'Updated desc',
    });
    expect(openSpy).toHaveBeenCalledWith('Session updated !', 'Close', {
      duration: 3000,
    });
    expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
  });
});
