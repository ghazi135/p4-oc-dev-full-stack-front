import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { expect } from '@jest/globals';

import { AuthService } from './auth.service';
import { RegisterRequest } from '../models/registerRequest.interface';
import { LoginRequest } from '../models/loginRequest.interface';
import { SessionInformation } from '../models/sessionInformation.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('register() doit appeler POST /api/auth/register avec le bon body', () => {
    // Arrange
    const payload: RegisterRequest = {
      email: 'test@yoga.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'Secret123',
    };
    let called = false;

    // Act
    service.register(payload).subscribe(() => {
      called = true;
    });

    const req = httpMock.expectOne('/api/auth/register');
    req.flush(null);

    // Assert
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(called).toBe(true);
  });

  it('login() doit appeler POST /api/auth/login et retourner un SessionInformation', () => {
    // Arrange
    const payload: LoginRequest = {
      email: 'test@yoga.com',
      password: 'Secret123',
    };

    const mockSession: SessionInformation = {
      token: 'token-123',
      type: 'Bearer',
      id: 1,
      username: 'test@yoga.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
    };

    let actual: SessionInformation | undefined;

    // Act
    service.login(payload).subscribe((session) => {
      actual = session;
    });

    const req = httpMock.expectOne('/api/auth/login');
    req.flush(mockSession);

    // Assert
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(actual).toEqual(mockSession);
  });
});
