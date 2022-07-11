import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './Frontend/dashboard/dashboard.component';
import { LoginComponent } from './Frontend/login/login.component';
import { MeetingRoomComponent } from './Frontend/meeting-room/meeting-room.component';
import { OrderListComponent } from './Frontend/order-list/order-list.component';
import { PantryComponent } from './Frontend/pantry/pantry.component';
import { WelcomeComponent } from './Frontend/welcome/welcome.component';

const routes: Routes = [
  { path : '' , pathMatch: 'full' , redirectTo : '/login' },
  { path : 'login' , component : LoginComponent },
  // { path : 'welcome' ,  redirectTo : '/super-admin'  }
  { path : 'welcome' , component : WelcomeComponent,
    children: [
      {path: 'dashboard', component: DashboardComponent},
      { path : 'meeting-room' , component : MeetingRoomComponent },
      {path: 'pantry', component: PantryComponent},
      {path: 'order-list', component: OrderListComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
