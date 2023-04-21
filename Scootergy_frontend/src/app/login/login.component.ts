import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AutenticarService} from "../autenticar.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  logInForm;

  constructor(private formBuilder: FormBuilder, private loginService: AutenticarService) {
    this.logInForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(formData: any): void {
    if (this.logInForm.invalid) {
      console.log(this.logInForm.errors);
    } else {
      this.loginService.logInUser(formData)
    }
  }
}
