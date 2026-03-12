import { Routes } from '@angular/router';
import { UnauthGuard } from "./guards/unauth.guard";
import { AuthGuard } from "./guards/auth.guard";
import { MeComponent } from "./components/me/me.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { ListComponent } from "./pages/sessions/components/list/list.component";
import { DetailComponent } from "./pages/sessions/components/detail/detail.component";
import { FormComponent } from "./pages/sessions/components/form/form.component";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'register',
    canActivate: [UnauthGuard],
    component: RegisterComponent
  },
  {
    path: 'login',
    canActivate: [UnauthGuard],
    component: LoginComponent
  },
  {
    path: 'sessions',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ListComponent,
        data: { title: 'Sessions' },
      },
      {
        path: 'detail/:id',
        component: DetailComponent,
        data: { title: 'Sessions - detail' },
      },
      {
        path: 'create',
        component: FormComponent,
        data: { title: 'Sessions - create' },
      },

      {
        path: 'update/:id',
        component: FormComponent,
        data: { title: 'Sessions - update' },
      },
      ]
  },
  {
    path: 'me',
    canActivate: [AuthGuard],
    component: MeComponent
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];


