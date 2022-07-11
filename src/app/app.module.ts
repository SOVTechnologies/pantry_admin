import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './Frontend/login/login.component';
import { WelcomeComponent } from './Frontend/welcome/welcome.component';
import { MeetingRoomComponent } from './Frontend/meeting-room/meeting-room.component';
import { PantryComponent } from './Frontend/pantry/pantry.component';
import { OrderListComponent } from './Frontend/order-list/order-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ServiceService } from './service/service.service';
import { HttpClientModule } from '@angular/common/http';
import { NgToastModule } from 'ng-angular-popup';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DashboardComponent } from './Frontend/dashboard/dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { NgxPaginationModule } from 'ngx-pagination';
import { HeaderComponent } from './Frontend/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomeComponent,
    MeetingRoomComponent,
    PantryComponent,
    OrderListComponent,
    DashboardComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSidenavModule,
    HttpClientModule,
    NgToastModule,
    Ng2SearchPipeModule,
    MatCardModule,
    NgxPaginationModule,
    MatToolbarModule,
    MatMenuModule
  ],
  providers: [ServiceService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
