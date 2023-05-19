import { TestBed } from '@angular/core/testing';

import { ResumenPagoGuard } from './resumen-pago.guard';

describe('ResumenPagoGuard', () => {
  let guard: ResumenPagoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ResumenPagoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
