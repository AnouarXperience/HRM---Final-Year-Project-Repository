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
import { AuthGuard } from './companets/auth/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { EspaceCandidatComponent } from './companets/acceuil/espace-candidat/espace-candidat.component';




const routes: Routes = [
  { path: '', redirectTo: "acceuil", pathMatch: "full" },
  { path: 'acceuil', component: AcceuilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'candidat', component: EspaceCandidatComponent },

  {
    path: "home", component: HomeComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable', 'Employee','Recruteur'] }, children: [
      { path: "", component: LayoutComponent },
      { path: "listemployee", component: EmployeeComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable'] } },
      { path: "detailsemployee/:id", component: DetailsComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable', 'Employee'] } },
      { path: "addemployee", component: AddemployeeComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur'] } },
      { path: "editemployee/:id", component: EditemployeeComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur'] } },
      { path: "profile/:id", component: ProfileComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable', 'Employee','Recruteur'] } },
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
