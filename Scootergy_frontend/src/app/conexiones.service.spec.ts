import { TestBed } from '@angular/core/testing';

import { ConexionesService } from './conexiones.service';

describe('ConexionesService', () => {
  let service: ConexionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConexionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
