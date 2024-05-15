import {  NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './companets/home/home.component';
import { HeaderComponent } from './companets/header/header.component';
import { SidebarComponent } from './companets/sidebar/sidebar.component';
import { FooterComponent } from './companets/footer/footer.component';
import { LayoutComponent } from './companets/layout/layout.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AcceuilComponent } from './companets/acceuil/acceuil.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './companets/acceuil/login/login.component';
import { EmployeeComponent } from './employee/employee.component';
import { AddemployeeComponent } from './employee/addemployee/addemployee.component';
import { EditemployeeComponent } from './employee/editemployee/editemployee.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoaderComponent } from './companets/loader/loader.component';
import { AuthGuard } from './companets/auth/auth.guard';
import { UserService } from './sevices/user.service';
import { AuthInterceptor } from './companets/auth/auth.interceptor';
import { ProfileComponent } from './profile/profile.component';
import { TokenExpirationService } from './sevices/token-expiration.service';
import { RechercheEmployeePipe } from './pipes/recherche-employee.pipe';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './employee/details/details.component';









@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LayoutComponent,
    AcceuilComponent,
    LoginComponent,
    EmployeeComponent,
    AddemployeeComponent,
    EditemployeeComponent,
    DetailsComponent,
    LoaderComponent,
    ProfileComponent,
    RechercheEmployeePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule, //formulaire
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [   AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass:AuthInterceptor,
      multi:true
    },
    UserService,
    TokenExpirationService
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
