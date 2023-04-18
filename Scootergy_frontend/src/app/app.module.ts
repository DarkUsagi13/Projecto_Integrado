import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS,HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { TemplateComponent } from './template/template.component';
import { LoginComponent } from './login/login.component';
import { PerfilComponent } from './perfil/perfil.component';
import { TokenInterceptor } from "./token.interceptor";
import { RegistroComponent } from './registro/registro.component';
import {NgOptimizedImage} from "@angular/common";
import { HomeComponent } from './home/home.component';
import { GestionPatinetesComponent } from './gestion-patinetes/gestion-patinetes.component';
import { DatosPerfilComponent } from './datos-perfil/datos-perfil.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { ConexionesModalComponent } from './conexiones-modal/conexiones-modal.component';
import { PlantillaPerfilComponent } from './plantilla-perfil/plantilla-perfil.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    LoginComponent,
    PerfilComponent,
    RegistroComponent,
    HomeComponent,
    GestionPatinetesComponent,
    DatosPerfilComponent,
    ConexionesModalComponent,
    PlantillaPerfilComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgOptimizedImage,
        NgbModule,
    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA ],
})
export class AppModule { }
