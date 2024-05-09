import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './companets/home/home.component';
import { LayoutComponent } from './companets/layout/layout.component';
import { AcceuilComponent } from './companets/acceuil/acceuil.component';
import { LoginComponent } from './companets/acceuil/login/login.component';
import { EmployeeComponent } from './employee/employee.component';
import { AddemployeeComponent } from './employee/addemployee/addemployee.component';
import { EditemployeeComponent } from './employee/editemployee/editemployee.component';
import { DetailsComponent } from './employee/details/details.component';
import { ResponsableComponent } from './responsable/responsable.component';
import { AddresponsableComponent } from './responsable/addresponsable/addresponsable.component';
import { EditresponsableComponent } from './responsable/editresponsable/editresponsable.component';
import { DetailsResComponent } from './responsable/details-res/details-res.component';
import { AuthGuard } from './companets/auth/auth.guard';
import { ProfileComponent } from './profile/profile.component';




const routes: Routes = [
  { path: '', redirectTo: "acceuil", pathMatch: "full" },
  { path: 'acceuil', component: AcceuilComponent },
  { path: 'login', component: LoginComponent },
  {
    path: "home", component: HomeComponent,canActivate:[AuthGuard], data:{roles:['ROLE_Administrateur']}, children: [
      { path: "", component: LayoutComponent },
      { path: "listemployee", component: EmployeeComponent },
      { path: "detailsemployee/:id", component: DetailsComponent },
      { path: "addemployee", component:AddemployeeComponent },
      { path: "editemployee/:id", component:EditemployeeComponent },
      { path: "listresponsable", component: ResponsableComponent },
      { path: "addresponsable", component: AddresponsableComponent },
      { path: "detailsResponsable/:id", component: DetailsResComponent },
      { path: "editresponsable/:id", component: EditresponsableComponent },
      { path: "profile", component: ProfileComponent },

    ]
  },
    // Ajoutez un chemin de route spécifique pour afficher uniquement le LoginComponent
    { path: 'acceuil/login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
