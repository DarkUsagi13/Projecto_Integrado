import { TestBed } from '@angular/core/testing';

import { WebSocketPuestosService } from './web-socket-puestos.service';

describe('WebSocketPuestosService', () => {
  let service: WebSocketPuestosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketPuestosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
