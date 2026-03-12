import { TestBed } from '@angular/core/testing';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { customJwtInterceptorFn } from './customJwtInterceptorFn';
import { SessionService } from '../core/service/session.service';
import { SessionInformation } from '../core/models/sessionInformation.interface';

describe('customJwtInterceptorFn', () => {
  let sessionService: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionService],
    });

    sessionService = TestBed.inject(SessionService);
  });

  it("doit ajouter le header Authorization quand l'utilisateur est connecté", () => {
    // Arrange
    const sessionInfo: SessionInformation = {
      token: 'token-123',
      type: 'Bearer',
      id: 1,
      username: 'user@yoga.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
    };

    sessionService.isLogged = true;
    sessionService.sessionInformation = sessionInfo;

    const initialRequest = new HttpRequest('GET', '/api/test');
    let receivedRequest: HttpRequest<unknown> | undefined;

    // Act
    TestBed.runInInjectionContext(() => {
      const next: HttpHandlerFn = (req: HttpRequest<unknown>) => {
        receivedRequest = req;
        return of({} as HttpEvent<unknown>);
      };

      customJwtInterceptorFn(initialRequest, next).subscribe();
    });

    // Assert
    expect(receivedRequest).toBeDefined();
    expect(receivedRequest!.headers.get('Authorization')).toBe(
      `Bearer ${sessionInfo.token}`,
    );
  });

  it("ne doit pas ajouter le header Authorization quand l'utilisateur n'est pas connecté", () => {
    // Arrange
    sessionService.isLogged = false;
    sessionService.sessionInformation = undefined;

    const initialRequest = new HttpRequest('GET', '/api/test');
    let receivedRequest: HttpRequest<unknown> | undefined;

    // Act
    TestBed.runInInjectionContext(() => {
      const next: HttpHandlerFn = (req: HttpRequest<unknown>) => {
        receivedRequest = req;
        return of({} as HttpEvent<unknown>);
      };

      customJwtInterceptorFn(initialRequest, next).subscribe();
    });

    // Assert
    expect(receivedRequest).toBeDefined();
    expect(receivedRequest!.headers.has('Authorization')).toBe(false);
  });
});
