import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionConexionesComponent } from './administracion-conexiones.component';

describe('AdministracionConexionesComponent', () => {
  let component: AdministracionConexionesComponent;
  let fixture: ComponentFixture<AdministracionConexionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionConexionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministracionConexionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
