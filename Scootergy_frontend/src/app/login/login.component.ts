import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AutenticarService} from "../autenticar.service";
import {Router} from "@angular/router";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  logInForm;
  validacion: boolean = false;
  mensajeError: string = '';
  submitted = false;

  constructor(private formBuilder: FormBuilder, private loginService: AutenticarService, private router: Router) {
    this.logInForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(formData: any): void {
    this.submitted = true;
    if (this.logInForm.invalid) {
      console.log(this.logInForm.errors);
    } else {

      this.loginService.logIn(formData.username, formData.password).subscribe({
        next: (data) => {
          this.loginService.setLoggedInUser(data);
          this.router.navigateByUrl(``);
        },
        error: (error) => {
          this.mensajeError = error.error.non_field_errors[0];
        }
      });
    }
  }
}
