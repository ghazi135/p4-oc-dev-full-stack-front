import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionInformation } from '../../../../core/models/sessionInformation.interface';
import { SessionService } from '../../../../core/service/session.service';
import { Session } from '../../../../core/models/session.interface';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { MaterialModule } from "../../../../shared/material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-list',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  private readonly sessionApiService = inject(SessionApiService);
  private readonly sessionService = inject(SessionService);

  public sessions$: Observable<Session[]> = this.sessionApiService.all();

  get user(): SessionInformation | undefined {
    return this.sessionService.sessionInformation;
  }
}
