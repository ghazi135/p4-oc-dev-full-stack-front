import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
import { User } from '../models/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getById() doit appeler GET api/user/:id', () => {
    // Arrange
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
    let actual: User | undefined;

    // Act
    service.getById('1').subscribe((user) => {
      actual = user;
    });

    const req = httpMock.expectOne('api/user/1');
    req.flush(mockUser);

    // Assert
    expect(req.request.method).toBe('GET');
    expect(actual).toEqual(mockUser);
  });

  it('delete() doit appeler DELETE api/user/:id', () => {
    // Arrange
    let called = false;

    // Act
    service.delete('1').subscribe(() => {
      called = true;
    });

    const req = httpMock.expectOne('api/user/1');
    req.flush(null);

    // Assert
    expect(req.request.method).toBe('DELETE');
    expect(called).toBe(true);
  });
});
