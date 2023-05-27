import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarBorrarModalComponent } from './confirmar-borrar-modal.component';

describe('ConfirmarBorrarModalComponent', () => {
  let component: ConfirmarBorrarModalComponent;
  let fixture: ComponentFixture<ConfirmarBorrarModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmarBorrarModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarBorrarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
