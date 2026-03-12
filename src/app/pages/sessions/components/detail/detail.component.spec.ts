import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { expect, jest } from '@jest/globals';

import { DetailComponent } from './detail.component';
import { SessionService } from 'src/app/core/service/session.service';
import { SessionApiService } from 'src/app/core/service/session-api.service';
import { TeacherService } from 'src/app/core/service/teacher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Session } from 'src/app/core/models/session.interface';
import { Teacher } from 'src/app/core/models/teacher.interface';

type SessionServiceMock = {
  sessionInformation: { id: number; admin: boolean };
};

type SessionApiServiceMock = {
  detail: jest.Mock;
  delete: jest.Mock;
  participate: jest.Mock;
  unParticipate: jest.Mock;
};

type TeacherServiceMock = {
  detail: jest.Mock;
};

type MatSnackBarMock = {
  open: jest.Mock;
};

type RouterMock = {
  navigate: jest.Mock;
};

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionServiceMock: SessionServiceMock;
  let sessionApiServiceMock: SessionApiServiceMock;
  let teacherServiceMock: TeacherServiceMock;
  let snackBarMock: MatSnackBarMock;
  let routerMock: RouterMock;

  beforeEach(async () => {
    const session: Session = {
      id: 1,
      name: 'Yoga doux',
      description: 'Relax',
      date: new Date(),
      teacher_id: 4,
      users: [1],
    };

    const teacher: Teacher = {
      id: 4,
      lastName: 'Doc',
      firstName: 'Gyneco',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sessionServiceMock = {
      sessionInformation: { id: 1, admin: true },
    };

    sessionApiServiceMock = {
      detail: jest.fn().mockReturnValue(of(session)),
      delete: jest.fn().mockReturnValue(of(void 0)),
      participate: jest.fn().mockReturnValue(of(void 0)),
      unParticipate: jest.fn().mockReturnValue(of(void 0)),
    };

    teacherServiceMock = {
      detail: jest.fn().mockReturnValue(of(teacher)),
    };

    snackBarMock = {
      open: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DetailComponent, BrowserAnimationsModule],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: SessionApiService, useValue: sessionApiServiceMock },
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
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

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit -> fetchSession()
  });

  it('should create', () => {
    // Arrange + Act
    // (fait dans beforeEach)

    // Assert
    expect(component).toBeTruthy();
  });

  it('ngOnInit() doit charger la session et le teacher', () => {
    // Arrange
    // (ngOnInit déjà exécuté)

    // Act
    // (rien à faire)

    // Assert
    expect(sessionApiServiceMock.detail).toHaveBeenCalledWith('1');
    expect(teacherServiceMock.detail).toHaveBeenCalledWith('4');
    expect(component.session).toBeDefined();
    expect(component.teacher).toBeDefined();
    expect(component.isParticipate).toBe(true);
    expect(component.isAdmin).toBe(true);
  });

  it('participate() doit appeler participate() puis recharger la session', () => {
    // Arrange
    const initialDetailCalls = sessionApiServiceMock.detail.mock.calls.length;

    // Act
    component.participate();

    // Assert
    expect(sessionApiServiceMock.participate).toHaveBeenCalledWith('1', '1');
    expect(sessionApiServiceMock.detail.mock.calls.length).toBe(
      initialDetailCalls + 1
    );
  });

  it('unParticipate() doit appeler unParticipate() puis recharger la session', () => {
    // Arrange
    const initialDetailCalls = sessionApiServiceMock.detail.mock.calls.length;

    // Act
    component.unParticipate();

    // Assert
    expect(sessionApiServiceMock.unParticipate).toHaveBeenCalledWith('1', '1');
    expect(sessionApiServiceMock.detail.mock.calls.length).toBe(
      initialDetailCalls + 1
    );
  });

  it("fetchSession() doit mettre isParticipate à false si l'utilisateur ne participe pas", () => {
    // Arrange
    const notParticipatingSession: Session = {
      id: 2,
      name: 'Yoga intense',
      description: 'Hard',
      date: new Date(),
      teacher_id: 4,
      users: [],
    };
    sessionApiServiceMock.detail.mockReturnValueOnce(
      of(notParticipatingSession)
    );

    // Act
    (component as unknown as { fetchSession: () => void }).fetchSession();

    // Assert
    expect(component.session).toEqual(notParticipatingSession);
    expect(component.isParticipate).toBe(false);
  });
});
