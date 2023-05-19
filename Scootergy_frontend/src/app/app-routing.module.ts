import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {PerfilComponent} from "./perfil/perfil.component";
import { AuthGuard } from "./auth.guard";
import {RegistroComponent} from "./registro/registro.component";
import {HomeComponent} from "./home/home.component";
import {GestionPatinetesComponent} from "./gestion-patinetes/gestion-patinetes.component";
import {DatosPerfilComponent} from "./datos-perfil/datos-perfil.component";
import {ResumenPagoComponent} from "./resumen-pago/resumen-pago.component";
import {HistorialConexionesComponent} from "./historial-conexiones/historial-conexiones.component";
import {ResumenPagoGuard} from "./resumen-pago.guard";

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'registro', component: RegistroComponent},
  {path: 'login', component: LoginComponent},
  {path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard]},
  {path: 'perfil/editar_perfil', component: DatosPerfilComponent, canActivate: [AuthGuard]},
  {path: 'patinetes', component: GestionPatinetesComponent, canActivate: [AuthGuard]},
  {path: 'perfil/registrar_patinete', component: GestionPatinetesComponent, canActivate: [AuthGuard]},
  {path: 'perfil/resumen_pago', component: ResumenPagoComponent, canActivate: [ResumenPagoGuard]},
  {path: 'perfil/historial_conexiones', component: HistorialConexionesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
