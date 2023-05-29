import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TemplateComponent} from './template/template.component';
import {LoginComponent} from './login/login.component';
import {ResumenPerfilComponent} from './resumen_perfil/perfil.component';
import {TokenInterceptor} from "./token.interceptor";
import {RegistroComponent} from './registro/registro.component';
import {NgOptimizedImage} from "@angular/common";
import {HomeComponent} from './home/home.component';
import {GestionPatinetesComponent} from './registrar_patinete/gestion-patinetes.component';
import {DetallesPerfilComponent} from './detalles_perfil/datos-perfil.component';
import {NgbModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ConexionesModalComponent} from './conexiones-modal/conexiones-modal.component';
import {PlantillaPerfilComponent} from './plantilla-perfil/plantilla-perfil.component';
import {RouterModule} from '@angular/router';
import {ResumenPagoComponent} from './resumen-pago/resumen-pago.component';
import { HistorialConexionesComponent } from './historial-conexiones/historial-conexiones.component';
import { ListadoPatinetesComponent } from './listado-patinetes/listado-patinetes.component';
import { DetallesConexionComponent } from './detalles-conexion/detalles-conexion.component';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatLineModule} from "@angular/material/core";
import {MatSidenavModule} from "@angular/material/sidenav";
import { ConfirmarBorrarModalComponent } from './confirmar-borrar-modal/confirmar-borrar-modal.component';
import { ConfirmarPagoModalComponent } from './confirmar-pago-modal/confirmar-pago-modal.component';
import { DetallesPatineteComponent } from './detalles-patinete/detalles-patinete.component';
import { AdministradorComponent } from './administrador/administrador.component';
import { AdministracionUsuariosComponent } from './administracion-usuarios/administracion-usuarios.component';
import { PlantillaAdministracionComponent } from './plantilla-administracion/plantilla-administracion.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { AdministracionDetallesUsuarioComponent } from './administracion-detalles-usuario/administracion-detalles-usuario.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    LoginComponent,
    ResumenPerfilComponent,
    RegistroComponent,
    HomeComponent,
    GestionPatinetesComponent,
    DetallesPerfilComponent,
    ConexionesModalComponent,
    PlantillaPerfilComponent,
    ResumenPagoComponent,
    HistorialConexionesComponent,
    ListadoPatinetesComponent,
    DetallesConexionComponent,
    ConfirmarBorrarModalComponent,
    ConfirmarPagoModalComponent,
    DetallesPatineteComponent,
    AdministradorComponent,
    AdministracionUsuariosComponent,
    PlantillaAdministracionComponent,
    AdministracionDetallesUsuarioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    NgbModule,
    BrowserAnimationsModule,
    RouterModule,
    NgbPaginationModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatListModule,
    MatLineModule,
    MatSidenavModule,
    MatTooltipModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA],
})
export class AppModule {
}
