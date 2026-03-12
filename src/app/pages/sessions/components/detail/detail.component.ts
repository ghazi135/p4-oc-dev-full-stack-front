import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Teacher } from '../../../../core/models/teacher.interface';
import { SessionService } from '../../../../core/service/session.service';
import { TeacherService } from '../../../../core/service/teacher.service';
import { Session } from '../../../../core/models/session.interface';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { MaterialModule } from "../../../../shared/material.module";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-detail',
  imports: [CommonModule, MaterialModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  public session: Session | undefined;
  public teacher: Teacher | undefined;
  public isParticipate = false;
  public isAdmin = false;
  public sessionId: string;
  public userId: string;

  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly sessionService = inject(SessionService);
  private readonly sessionApiService = inject(SessionApiService);
  private readonly teacherService = inject(TeacherService);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  constructor() {
    this.sessionId = this.route.snapshot.paramMap.get('id')!;
    this.isAdmin = this.sessionService.sessionInformation!.admin;
    this.userId = this.sessionService.sessionInformation!.id.toString();
  }

  ngOnInit(): void {
    this.fetchSession();
  }

  public back(): void {
    window.history.back();
  }

  public delete(): void {
    this.sessionApiService
      .delete(this.sessionId)
      .subscribe(() => {
          this.matSnackBar.open('Session deleted !', 'Close', { duration: 3000 });
          this.router.navigate(['sessions']);
        }
      );
  }

  public participate(): void {
    this.sessionApiService.participate(this.sessionId, this.userId).subscribe(_ => this.fetchSession());
  }

  public unParticipate(): void {
    this.sessionApiService.unParticipate(this.sessionId, this.userId).subscribe(_ => this.fetchSession());
  }

  private fetchSession(): void {
    this.sessionApiService
      .detail(this.sessionId)
      .subscribe((session: Session) => {
        this.session = session;
        this.isParticipate = session.users.some(u => u === this.sessionService.sessionInformation!.id);
        this.teacherService
          .detail(session.teacher_id.toString())
          .subscribe((teacher: Teacher) => this.teacher = teacher);
      });
  }

}
