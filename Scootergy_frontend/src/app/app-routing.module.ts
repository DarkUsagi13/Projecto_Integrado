import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {ResumenPerfilComponent} from "./resumen_perfil/perfil.component";
import { AuthGuard } from "./auth.guard";
import {RegistroComponent} from "./registro/registro.component";
import {HomeComponent} from "./home/home.component";
import {GestionPatinetesComponent} from "./registrar_patinete/gestion-patinetes.component";
import {DetallesPerfilComponent} from "./detalles_perfil/datos-perfil.component";
import {ResumenPagoComponent} from "./resumen-pago/resumen-pago.component";
import {HistorialConexionesComponent} from "./historial-conexiones/historial-conexiones.component";
import {ResumenPagoGuard} from "./resumen-pago.guard";
import {ListadoPatinetesComponent} from "./listado-patinetes/listado-patinetes.component";
import {DetallesConexionComponent} from "./detalles-conexion/detalles-conexion.component";

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'registro', component: RegistroComponent},
  {path: 'login', component: LoginComponent},
  {path: 'perfil', component: ResumenPerfilComponent, canActivate: [AuthGuard]},
  {path: 'perfil/editar_perfil', component: DetallesPerfilComponent, canActivate: [AuthGuard]},
  {path: 'patinetes', component: GestionPatinetesComponent, canActivate: [AuthGuard]},
  {path: 'perfil/registrar_patinete', component: GestionPatinetesComponent, canActivate: [AuthGuard]},
  {path: 'perfil/listado_patinetes', component: ListadoPatinetesComponent, canActivate: [AuthGuard]},
  {path: 'perfil/resumen_pago', component: ResumenPagoComponent, canActivate: [ResumenPagoGuard]},
  {path: 'perfil/historial_conexiones', component: HistorialConexionesComponent, canActivate: [AuthGuard]},
  {path: 'perfil/historial_conexiones/detalles_conexion/:id', component: DetallesConexionComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
