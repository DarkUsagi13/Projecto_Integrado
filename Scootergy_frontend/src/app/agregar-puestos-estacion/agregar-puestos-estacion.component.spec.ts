import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarPuestosEstacionComponent } from './agregar-puestos-estacion.component';

describe('AgregarPuestosEstacionComponent', () => {
  let component: AgregarPuestosEstacionComponent;
  let fixture: ComponentFixture<AgregarPuestosEstacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgregarPuestosEstacionComponent]
    });
    fixture = TestBed.createComponent(AgregarPuestosEstacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
