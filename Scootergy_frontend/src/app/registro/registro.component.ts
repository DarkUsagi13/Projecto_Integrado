import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AutenticarService} from "../autenticar.service";
import {validarPassword} from "../../utils/validators-utils";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {

  public formulario!: FormGroup;
  public errores: any = {};

  public usernameInvalid = 'El nombre de usuario debe incluir: al menos una letra, y puede incluir letras, números, puntos, ' +
    'guiones bajos y guiones medios. Además, debe tener una longitud de 5 a 16 caracteres.'

  public emailInvalid = 'El correo electrónico debe tener un formato válido. Ejemplo: example@example.com'

  public passwordInvalid = String.raw`La contraseña debe tener al menos 8 caracteres e incluir al menos una letra mayúscula, una
  letra minúscula y un carácter especial como !@#$%^&*()\-=+_{};':"|,.<>?`;


  constructor(
    private fb: FormBuilder,
    private autenticarService: AutenticarService,
  ) {

    const usernameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9._-]{5,16}$/
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()\-=_+{};':"|,.<>?]).{8,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    this.formulario = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.pattern(usernameRegex)]),
      email: new FormControl('', [Validators.required, Validators.pattern(emailRegex)]),
      password: new FormControl('', [Validators.required, Validators.pattern(passwordRegex)]),
      password2: new FormControl('', [Validators.required, validarPassword])
    })

  }

  registrarUsuario(formData: any) {
    if (this.formulario.invalid) {
      console.log('Alguna validación ha fallado')
    } else {
      this.autenticarService.nuevoUsuario(this.formulario.value).subscribe({
        next: (data) => {
          this.autenticarService.logInUser(formData);
        },
        error: (error) => {
          this.errores = error.error;
          if (error.statusText == 'Unknown Error') {
            this.errores = {errorServer: 'No se ha podido conectar al servidor'};
          }
        }
      });
    }
  }

}
