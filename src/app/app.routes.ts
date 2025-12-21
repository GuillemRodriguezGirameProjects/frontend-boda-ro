import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InvitationComponent } from './invitation/invitation.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'invitations/:id',
    component: InvitationComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
