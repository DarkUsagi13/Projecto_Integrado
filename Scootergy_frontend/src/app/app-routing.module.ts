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
import {ConfirmarBorrarModalComponent} from "./confirmar-borrar-modal/confirmar-borrar-modal.component";
import {DetallesPatineteComponent} from "./detalles-patinete/detalles-patinete.component";
import {AdministradorComponent} from "./administrador/administrador.component";
import {AdministracionUsuariosComponent} from "./administracion-usuarios/administracion-usuarios.component";
import {
  AdministracionEstacionesCargaComponent
} from "./administracion-estaciones-carga/administracion-estaciones-carga.component";
import {AdministracionConexionesComponent} from "./administracion-conexiones/administracion-conexiones.component";

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'registro', component: RegistroComponent},
  {path: 'login', component: LoginComponent},
  {path: 'perfil', component: ResumenPerfilComponent, canActivate: [AuthGuard]},
  {path: 'perfil/editar_perfil', component: DetallesPerfilComponent, canActivate: [AuthGuard]},
  {path: 'patinetes', component: GestionPatinetesComponent, canActivate: [AuthGuard]},
  {path: 'perfil/registrar_patinete', component: GestionPatinetesComponent, canActivate: [AuthGuard]},
  {path: 'perfil/listado_patinetes', component: ListadoPatinetesComponent, canActivate: [AuthGuard]},
  {path: 'perfil/listado_patinetes/detalles_patinete/:id', component: DetallesPatineteComponent, canActivate: [AuthGuard]},
  {path: 'perfil/listado_patinetes/eliminar:id', component: ConfirmarBorrarModalComponent, canActivate: [AuthGuard]},
  {path: 'perfil/resumen_pago', component: ResumenPagoComponent, canActivate: [ResumenPagoGuard]},
  {path: 'perfil/historial_conexiones', component: HistorialConexionesComponent, canActivate: [AuthGuard]},
  {path: 'perfil/historial_conexiones/detalles_conexion/:id', component: DetallesConexionComponent, canActivate: [AuthGuard]},
  {path: 'administracion', component: AdministradorComponent, canActivate: [AuthGuard] },
  {path: 'administracion/usuarios', component:AdministracionUsuariosComponent, canActivate: [AuthGuard] },
  {path: 'administracion/estaciones', component: AdministracionEstacionesCargaComponent, canActivate: [AuthGuard]},
  {path: 'administracion/conexiones', component: AdministracionConexionesComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
