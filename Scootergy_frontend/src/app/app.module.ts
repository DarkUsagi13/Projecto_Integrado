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
