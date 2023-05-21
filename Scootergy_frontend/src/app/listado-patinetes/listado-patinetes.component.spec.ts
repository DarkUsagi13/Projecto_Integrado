import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPatinetesComponent } from './listado-patinetes.component';

describe('ListadoPatinetesComponent', () => {
  let component: ListadoPatinetesComponent;
  let fixture: ComponentFixture<ListadoPatinetesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoPatinetesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoPatinetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
