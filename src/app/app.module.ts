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
import { ResponsableComponent } from './responsable/responsable.component';
import { AddresponsableComponent } from './responsable/addresponsable/addresponsable.component';
import { EditresponsableComponent } from './responsable/editresponsable/editresponsable.component';
import { DetailsResComponent } from './responsable/details-res/details-res.component';
import { LoaderComponent } from './companets/loader/loader.component';
import { AuthGuard } from './companets/auth/auth.guard';
import { UserService } from './sevices/user.service';
import { AuthInterceptor } from './companets/auth/auth.interceptor';
import { ProfileComponent } from './profile/profile.component';









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
    ResponsableComponent,
    AddresponsableComponent,
    EditresponsableComponent,
    DetailsResComponent,
    LoaderComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule, //formulaire
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    ReactiveFormsModule
  ],
  providers: [   AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass:AuthInterceptor,
      multi:true
    },
    UserService
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
