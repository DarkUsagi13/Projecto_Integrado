import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillaAdministracionComponent } from './plantilla-administracion.component';

describe('PlantillaAdministracionComponent', () => {
  let component: PlantillaAdministracionComponent;
  let fixture: ComponentFixture<PlantillaAdministracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantillaAdministracionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantillaAdministracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
