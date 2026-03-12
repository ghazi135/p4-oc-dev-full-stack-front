import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { Session } from '../models/session.interface';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), 
        provideHttpClientTesting(), 
        SessionApiService,
      ],
    });

    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('all() doit appeler GET api/session', () => {
    // Arrange
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
    let actual: Session[] | undefined;

    // Act
    service.all().subscribe((sessions) => {
      actual = sessions;
    });

    const req = httpMock.expectOne('api/session');
    req.flush(mockSessions);

    // Assert
    expect(req.request.method).toBe('GET');
    expect(actual).toEqual(mockSessions);
  });

  it('detail() doit appeler GET api/session/:id', () => {
    // Arrange
    const mockSession: Session = {
      id: 1,
      name: 'Yoga doux',
      description: 'Relax',
      date: new Date(),
      teacher_id: 4,
      users: [],
    };
    let actual: Session | undefined;

    // Act
    service.detail('1').subscribe((session) => {
      actual = session;
    });

    const req = httpMock.expectOne('api/session/1');
    req.flush(mockSession);

    // Assert
    expect(req.request.method).toBe('GET');
    expect(actual).toEqual(mockSession);
  });

  it('delete() doit appeler DELETE api/session/:id', () => {
    // Arrange
    let called = false;

    // Act
    service.delete('1').subscribe(() => {
      called = true;
    });

    const req = httpMock.expectOne('api/session/1');
    req.flush(null);

    // Assert
    expect(req.request.method).toBe('DELETE');
    expect(called).toBe(true);
  });

  it('create() doit appeler POST api/session', () => {
    // Arrange
    const payload: Session = {
      name: 'New session',
      description: 'Description',
      date: new Date(),
      teacher_id: 5,
      users: [],
    };

    const created: Session = { ...payload, id: 2 };
    let actual: Session | undefined;

    // Act
    service.create(payload).subscribe((session) => {
      actual = session;
    });

    const req = httpMock.expectOne('api/session');
    req.flush(created);

    // Assert
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(actual).toEqual(created);
  });

  it('update() doit appeler PUT api/session/:id', () => {
    // Arrange
    const payload: Session = {
      id: 1,
      name: 'Updated session',
      description: 'Updated desc',
      date: new Date(),
      teacher_id: 4,
      users: [],
    };
    let actual: Session | undefined;

    // Act
    service.update('1', payload).subscribe((session) => {
      actual = session;
    });

    const req = httpMock.expectOne('api/session/1');
    req.flush(payload);

    // Assert
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    expect(actual).toEqual(payload);
  });

  it('participate() doit appeler POST api/session/:id/participate/:userId', () => {
    // Arrange
    let called = false;

    // Act
    service.participate('1', '10').subscribe(() => {
      called = true;
    });

    const req = httpMock.expectOne('api/session/1/participate/10');
    req.flush(null);

    // Assert
    expect(req.request.method).toBe('POST');
    expect(called).toBe(true);
  });

  it('unParticipate() doit appeler DELETE api/session/:id/participate/:userId', () => {
    // Arrange
    let called = false;

    // Act
    service.unParticipate('1', '10').subscribe(() => {
      called = true;
    });

    const req = httpMock.expectOne('api/session/1/participate/10');
    req.flush(null);

    // Assert
    expect(req.request.method).toBe('DELETE');
    expect(called).toBe(true);
  });
});
