import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesConexionComponent } from './detalles-conexion.component';

describe('DetallesConexionComponent', () => {
  let component: DetallesConexionComponent;
  let fixture: ComponentFixture<DetallesConexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesConexionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesConexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
