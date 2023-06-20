import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeComponent} from './home.component';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule} from "@angular/router";
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
import {TemplateComponent} from "../template/template.component";
import {PatinetesService} from "../patinetes.service";
import {of} from "rxjs";
import {ConexionesService} from "../conexiones.service";
import {HttpTestingController} from "@angular/common/http/testing";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let patinetesService: PatinetesService;
  let conexionesService: ConexionesService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        TemplateComponent,
      ],
      imports: [
        CommonModule,
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
      providers: [PatinetesService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    patinetesService = TestBed.inject(PatinetesService);
    conexionesService = TestBed.inject(ConexionesService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve patinetes and call mostrarEstaciones', () => {
    const mockResponse = {
      status: 200,

      body: {
        "modelo": "http://localhost:8000/modelo/26/",
        "usuario": "http://localhost:8000/usuario/2/",
      },

    };
    spyOn(patinetesService, 'patinetes').and.returnValue(of(mockResponse));
    spyOn(component, 'mostrarEstaciones');

    component.getPatinetes();

    expect(patinetesService.patinetes).toHaveBeenCalledOnceWith(component.usuario, '');
    expect(component.mostrarEstaciones).toHaveBeenCalled();
    expect(component.animacionCarga).toBe(false);
  });

  it('should retrieve active connections for a user', () => {
    const userId = '123';

    const mockResponse = [
      {estacionNombre: 'Estación A'},
      {estacionNombre: 'Estación B'}
    ];

    // Espiar en el método getConexionesActivas y simular la respuesta
    spyOn(conexionesService, 'getConexionesActivas').and.returnValue(of(mockResponse));
    conexionesService.conexionesActivas = [
      {estacionNombre: 'Estación A'},
      {estacionNombre: 'Estación B'}
    ]

    conexionesService.getConexionesActivas(userId).subscribe(conexiones => {
      expect(conexiones).toEqual(mockResponse);
      expect(conexionesService.conexionesActivas).toEqual(mockResponse);
      expect(conexionesService.conexionesActivas.length).toBe(2);
    });
  });
});
