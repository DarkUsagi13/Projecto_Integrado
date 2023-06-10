import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConexionesActivasComponent } from './conexiones-activas.component';

describe('ConexionesActivasComponent', () => {
  let component: ConexionesActivasComponent;
  let fixture: ComponentFixture<ConexionesActivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConexionesActivasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConexionesActivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
