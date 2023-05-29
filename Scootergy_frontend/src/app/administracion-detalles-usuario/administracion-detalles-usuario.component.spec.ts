import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionDetallesUsuarioComponent } from './administracion-detalles-usuario.component';

describe('AdministracionDetallesUsuarioComponent', () => {
  let component: AdministracionDetallesUsuarioComponent;
  let fixture: ComponentFixture<AdministracionDetallesUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionDetallesUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministracionDetallesUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
