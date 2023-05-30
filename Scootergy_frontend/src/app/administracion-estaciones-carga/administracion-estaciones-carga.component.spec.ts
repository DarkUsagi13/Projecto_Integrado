import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionEstacionesCargaComponent } from './administracion-estaciones-carga.component';

describe('AdministracionEstacionesCargaComponent', () => {
  let component: AdministracionEstacionesCargaComponent;
  let fixture: ComponentFixture<AdministracionEstacionesCargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionEstacionesCargaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministracionEstacionesCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
