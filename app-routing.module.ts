import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { TicketsDetailsComponent } from './home/tickets-details/tickets-details.component';
import { UserAccessComponent } from './home/user-access/user-access.component';
import { TicketViewComponent } from './home/ticket-view/ticket-view.component';

import { AuthGuard } from './home/auth.guard';

const routes: Routes = [
  { path: '',redirectTo: '/login',pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  
  { path: 'sign-up', component: SignUpComponent },
  { path: 'home', component: HomeComponent,
    children: [
      {
        path:'',redirectTo: 'dashboard',pathMatch: 'full'
      },
      {
        path:'dashboard', component: DashboardComponent , canActivate: [AuthGuard]
      },
      {
        path:'tickets', component: TicketsDetailsComponent , canActivate: [AuthGuard]
      },
      {
        path:'users', component: UserAccessComponent
      },
      {
         path: 'ticket-view/:id', component: TicketViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
