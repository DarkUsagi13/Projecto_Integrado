import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {PerfilComponent} from "./perfil/perfil.component";
import { AuthGuard } from "./auth.guard";
import {RegistroComponent} from "./registro/registro.component";
import {HomeComponent} from "./home/home.component";
import {GestionPatinetesComponent} from "./gestion-patinetes/gestion-patinetes.component";
import {DatosPerfilComponent} from "./datos-perfil/datos-perfil.component";

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'registro', component: RegistroComponent},
  {path: 'login', component: LoginComponent},
  {path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard]},
  {path: 'perfil/editar_perfil', component: DatosPerfilComponent, canActivate: [AuthGuard]},
  {path: 'patinetes', component: GestionPatinetesComponent, canActivate: [AuthGuard]},
  {path: 'registrar_patinete', component: GestionPatinetesComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
