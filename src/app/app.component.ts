import { Component, inject } from '@angular/core';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './core/service/auth.service';
import { SessionService } from './core/service/session.service';
import {CommonModule} from "@angular/common";
import {MaterialModule} from "./shared/material.module";

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, MaterialModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionService);

  public $isLogged(): Observable<boolean> {
    return this.sessionService.$isLogged();
  }

  public logout(): void {
    this.sessionService.logOut();
    this.router.navigate([''])
  }
}
