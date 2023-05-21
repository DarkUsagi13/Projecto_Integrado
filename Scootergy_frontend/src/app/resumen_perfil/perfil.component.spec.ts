import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenPerfilComponent } from './perfil.component';

describe('PerfilComponent', () => {
  let component: ResumenPerfilComponent;
  let fixture: ComponentFixture<ResumenPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumenPerfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
