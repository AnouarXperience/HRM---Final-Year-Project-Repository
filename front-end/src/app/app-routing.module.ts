import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './companets/home/home.component';
import { LayoutComponent } from './companets/layout/layout.component';
import { ListproductComponent } from './listproduct/listproduct.component';
import { DetailsComponent } from './listproduct/details/details.component';
import { EditComponent } from './listproduct/edit/edit.component';
import { AcceuilComponent } from './companets/acceuil/acceuil.component';
import { LoginComponent } from './companets/acceuil/login/login.component';


const routes: Routes = [
  { path: '', redirectTo: "acceuil", pathMatch: "full" },
  { path: 'acceuil', component: AcceuilComponent },
  { path: 'login', component: LoginComponent },
  {
    path: "home", component: HomeComponent, children: [
      { path: "", component: LayoutComponent },
      { path: "listproduct", component: ListproductComponent },
      { path: "details/:id", component: DetailsComponent },
      { path: "edit/:id", component: EditComponent }
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
