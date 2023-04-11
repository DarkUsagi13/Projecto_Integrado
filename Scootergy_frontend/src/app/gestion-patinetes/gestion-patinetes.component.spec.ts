import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPatinetesComponent } from './gestion-patinetes.component';

describe('GestionPatinetesComponent', () => {
  let component: GestionPatinetesComponent;
  let fixture: ComponentFixture<GestionPatinetesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionPatinetesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPatinetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
