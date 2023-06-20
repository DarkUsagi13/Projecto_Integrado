import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateComponent } from './template.component';
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {UsuariosService} from "../usuario.service";
import {of} from "rxjs";

describe('TemplateComponent', () => {
  let component: TemplateComponent;
  let fixture: ComponentFixture<TemplateComponent>;
  let router: Router;
  let usuariosService: UsuariosService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateComponent ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    usuariosService = TestBed.inject(UsuariosService);
    fixture.detectChanges();
    spyOn(router, 'navigateByUrl').and.stub(); // Actualizamos esta línea

    spyOn(localStorage, 'removeItem'); // Agregamos esta línea

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log out and navigate to /login', () => {
    component.logOut();
    expect(localStorage.removeItem).toHaveBeenCalledWith('userData');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should set staff to true when usuario is staff', () => {
    const usuarioMock = { is_staff: true };
    spyOn(usuariosService, 'perfil').and.returnValue(of(usuarioMock));

    component.isStaff();

    expect(usuariosService.perfil).toHaveBeenCalled();
    expect(component.staff).toBe(true);
  });

  it('should set staff to false when usuario is not staff', () => {
    const usuarioMock = { is_staff: false };
    spyOn(usuariosService, 'perfil').and.returnValue(of(usuarioMock));

    component.isStaff();

    expect(usuariosService.perfil).toHaveBeenCalled();
    expect(component.staff).toBe(false);
  });

});
