import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuariosService } from './usuario.service';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuariosService],
    });
    service = TestBed.inject(UsuariosService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should obtain user id', () => {
    const userId = '123';
    const userData = { id: userId };
    localStorage.setItem('userData', JSON.stringify(userData));

    const result = service.obtenerIdUsuario();

    expect(result).toEqual(userId);
  });

  it('should return "Usuario no encontrado" if user data is not present', () => {
    localStorage.removeItem('userData');

    const result = service.obtenerIdUsuario();

    expect(result).toEqual('Usuario no encontrado');
  });

  // it('should make a GET request to get user profile', () => {
  //   const userId = '1';
  //   const response = { name: ' admin' +
  //       '' };
  //
  //   service.perfil(userId).subscribe((res) => {
  //     expect(res).toEqual(response);
  //   });
  //
  //   const req = httpTestingController.expectOne(`usuario/${userId}/`);
  //   expect(req.request.method).toBe('GET');
  //   expect(req.request.headers.has('Authorization')).toBe(true);
  //   expect(req.request.headers.get('Authorization')).toBe('Bearer <70a7ad8efc3a3abbd2cfa125276139bab7b96535>');
  //   req.flush(response);
  // });
});
