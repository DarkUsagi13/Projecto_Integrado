import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConexionesModalComponent } from './conexiones-modal.component';

describe('ConexionesModalComponent', () => {
  let component: ConexionesModalComponent;
  let fixture: ComponentFixture<ConexionesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConexionesModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConexionesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
