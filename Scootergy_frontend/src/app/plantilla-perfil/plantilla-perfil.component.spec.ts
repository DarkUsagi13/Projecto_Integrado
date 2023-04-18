import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillaPerfilComponent } from './plantilla-perfil.component';

describe('PlantillaPerfilComponent', () => {
  let component: PlantillaPerfilComponent;
  let fixture: ComponentFixture<PlantillaPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantillaPerfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantillaPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
