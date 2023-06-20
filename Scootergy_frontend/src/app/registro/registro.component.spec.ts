import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroComponent } from './registro.component';
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "../app-routing.module";
import {BrowserModule} from "@angular/platform-browser";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";
import {NgbModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatLineModule, MatNativeDateModule} from "@angular/material/core";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {NgxPaginationModule} from "ngx-pagination";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatDialogModule} from "@angular/material/dialog";
import {AutenticarService} from "../autenticar.service";
import {of} from "rxjs";

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let autenticarService: AutenticarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroComponent],
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
        NgxDatatableModule,
        NgxPaginationModule,
        MatPaginatorModule,
        MatSortModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    autenticarService = TestBed.inject(AutenticarService);

    spyOn(autenticarService, 'nuevoUsuario').and.returnValue(of({}));
    spyOn(autenticarService, 'logInUser');

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the correct controls', () => {
    expect(component.formulario.get('username')).toBeInstanceOf(FormControl);
    expect(component.formulario.get('email')).toBeInstanceOf(FormControl);
    expect(component.formulario.get('password')).toBeInstanceOf(FormControl);
    expect(component.formulario.get('password2')).toBeInstanceOf(FormControl);
  });

  it('should call nuevoUsuario and logInUser methods when formulario is valid', () => {
    const formData = {
      username: 'testUser',
      email: 'test@example.com',
      password: 'Test123!',
      password2: 'Test123!',
    };
    component.formulario.setValue(formData);

    component.registrarUsuario(formData);

    expect(autenticarService.nuevoUsuario).toHaveBeenCalledWith(formData);
    expect(autenticarService.logInUser).toHaveBeenCalledWith(formData);
  });

  it('should not call nuevoUsuario and logInUser methods when formulario is invalid', () => {
    component.formulario.setErrors({ invalid: true });

    component.registrarUsuario({});

    expect(autenticarService.nuevoUsuario).not.toHaveBeenCalled();
    expect(autenticarService.logInUser).not.toHaveBeenCalled();
  });


});
