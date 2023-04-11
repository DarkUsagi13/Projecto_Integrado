import { TestBed } from '@angular/core/testing';

import { AutenticarService } from './autenticar.service';
import {HttpClient, HttpClientModule} from "@angular/common/http";

describe('AutenticarService', () => {
  let service: AutenticarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(AutenticarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
