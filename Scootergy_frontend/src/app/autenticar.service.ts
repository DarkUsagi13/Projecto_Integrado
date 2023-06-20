import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Credenciales, LoggedInUser} from "./autenticar";
import {HttpClient} from "@angular/common/http";
import {Usuario} from "./usuario";
import {Router} from "@angular/router";
import {url} from "./utils";

@Injectable({
  providedIn: 'root'
})
export class AutenticarService {

  url: any= url()

  constructor(private http: HttpClient, private router: Router) {
  }

  setLoggedInUser(userData: LoggedInUser): void {
    if (localStorage.getItem('userData') !== JSON.stringify(userData)) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }

  nuevoUsuario(usuario: Usuario): Observable<any> {
    return this.http.post<any>(this.url+'registro/', usuario);
  }

  logIn(username: string, password: string): Observable<any> {
    return this.http.post(
      this.url+'api-user-login/', {username, password}
    ) as Observable<any>;
  }

  logInUser(user: Credenciales): void {
    this.logIn(user.username, user.password).subscribe({
      next: (data) => {
        this.setLoggedInUser(data);
        this.router.navigateByUrl(``);
      }
    });
  }

}
