import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesPatineteComponent } from './detalles-patinete.component';

describe('DetallesPatineteComponent', () => {
  let component: DetallesPatineteComponent;
  let fixture: ComponentFixture<DetallesPatineteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesPatineteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesPatineteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
