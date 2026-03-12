import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { Teacher } from '../models/teacher.interface';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TeacherService,
      ],
    });

    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('all() doit appeler GET api/teacher', () => {
    // Arrange
    const now = new Date();
    const mockTeachers: Teacher[] = [
      {
        id: 4,
        lastName: 'Doc',
        firstName: 'Gyneco',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 5,
        lastName: 'Marley',
        firstName: 'Bob',
        createdAt: now,
        updatedAt: now,
      },
    ];
    let actual: Teacher[] | undefined;

    // Act
    service.all().subscribe((teachers) => {
      actual = teachers;
    });

    const req = httpMock.expectOne('api/teacher');
    req.flush(mockTeachers);

    // Assert
    expect(req.request.method).toBe('GET');
    expect(actual).toEqual(mockTeachers);
  });

  it('detail() doit appeler GET api/teacher/:id', () => {
    // Arrange
    const now = new Date();
    const mockTeacher: Teacher = {
      id: 4,
      lastName: 'Doc',
      firstName: 'Gyneco',
      createdAt: now,
      updatedAt: now,
    };
    let actual: Teacher | undefined;

    // Act
    service.detail('4').subscribe((teacher) => {
      actual = teacher;
    });

    const req = httpMock.expectOne('api/teacher/4');
    req.flush(mockTeacher);

    // Assert
    expect(req.request.method).toBe('GET');
    expect(actual).toEqual(mockTeacher);
  });
});
