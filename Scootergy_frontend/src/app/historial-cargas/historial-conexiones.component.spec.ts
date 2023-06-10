import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialConexionesComponent } from './historial-conexiones.component';

describe('HistorialConexionesComponent', () => {
  let component: HistorialConexionesComponent;
  let fixture: ComponentFixture<HistorialConexionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialConexionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialConexionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
