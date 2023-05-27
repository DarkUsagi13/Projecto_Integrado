import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarPagoModalComponent } from './confirmar-pago-modal.component';

describe('ConfirmarPagoModalComponent', () => {
  let component: ConfirmarPagoModalComponent;
  let fixture: ComponentFixture<ConfirmarPagoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmarPagoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarPagoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
