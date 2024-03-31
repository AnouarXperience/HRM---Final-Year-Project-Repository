import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './companets/home/home.component';
import { HeaderComponent } from './companets/header/header.component';
import { SidebarComponent } from './companets/sidebar/sidebar.component';
import { FooterComponent } from './companets/footer/footer.component';
import { LayoutComponent } from './companets/layout/layout.component';
import { ListproductComponent } from './listproduct/listproduct.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailsComponent } from './listproduct/details/details.component';
import { EditComponent } from './listproduct/edit/edit.component';
import { AcceuilComponent } from './companets/acceuil/acceuil.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './companets/acceuil/login/login.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LayoutComponent,
    ListproductComponent,
    DetailsComponent,
    EditComponent,
    AcceuilComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule, //formulaire
    FormsModule, 
    NgbModule //ngmodel
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
