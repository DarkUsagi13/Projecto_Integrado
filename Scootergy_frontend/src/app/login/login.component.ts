import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AutenticarService} from "../autenticar.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  logInForm;
  errores: any = '';
  showPasswordTooltip = false;

  constructor(private formBuilder: FormBuilder, private loginService: AutenticarService, private router: Router) {
    this.logInForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    console.log(this.errores)
  }

  onSubmit(formData: any): void {
    if (this.logInForm.invalid) {
      this.showPasswordTooltip = true;
    } else {

      this.loginService.logIn(formData.username, formData.password).subscribe({
        next: (data) => {
          this.loginService.setLoggedInUser(data);
          this.router.navigateByUrl(``);
        },
        error: (error) => {
          this.errores = {invalid:'Credenciales incorrectas'}
          console.log(this.errores)
        }
      });
    }
  }

}
