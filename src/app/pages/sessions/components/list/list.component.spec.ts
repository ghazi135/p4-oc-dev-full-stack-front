import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { expect, jest } from '@jest/globals';

import { ListComponent } from './list.component';
import { SessionApiService } from 'src/app/core/service/session-api.service';
import { SessionService } from 'src/app/core/service/session.service';
import { Session } from 'src/app/core/models/session.interface';
import { SessionInformation } from 'src/app/core/models/sessionInformation.interface';

type SessionApiServiceMock = {
  all: jest.Mock;
};

type SessionServiceMock = {
  sessionInformation: SessionInformation;
};

type RouterMock = {
  navigate: jest.Mock;
};

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionApiServiceMock: SessionApiServiceMock;
  let sessionServiceMock: SessionServiceMock;
  let routerMock: RouterMock;

  beforeEach(async () => {
    const mockSessions: Session[] = [
      {
        id: 1,
        name: 'Yoga doux',
        description: 'Relax',
        date: new Date(),
        teacher_id: 4,
        users: [],
      },
    ];

    const mockUser: SessionInformation = {
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'user@yoga.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
    };

    sessionApiServiceMock = {
      all: jest.fn().mockReturnValue(of(mockSessions)),
    };

    sessionServiceMock = {
      sessionInformation: mockUser,
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ListComponent, BrowserAnimationsModule],
      providers: [
        { provide: SessionApiService, useValue: sessionApiServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Arrange + Act

    // Assert
    expect(component).toBeTruthy();
  });

  it('doit exposer les sessions via sessions$', (done) => {
    // Arrange
    // (sessions$ déjà initialisé)

    // Act
    component.sessions$.subscribe((sessions) => {
      // Assert
      expect(sessions.length).toBe(1);
      expect(sessions[0].name).toBe('Yoga doux');
      done();
    });
  });

  it('doit exposer l\'utilisateur courant via le getter user', () => {
    // Arrange + Act
    const user = component.user;

    // Assert
    expect(user).toBeDefined();
    expect(user?.id).toBe(1);
  });
});
