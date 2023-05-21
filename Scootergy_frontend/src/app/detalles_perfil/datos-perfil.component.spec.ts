import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesPerfilComponent } from './datos-perfil.component';

describe('DetallesPerfilComponent', () => {
  let component: DetallesPerfilComponent;
  let fixture: ComponentFixture<DetallesPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesPerfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
