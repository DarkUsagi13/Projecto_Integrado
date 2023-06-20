import {Component} from '@angular/core';
import {UsuariosService} from '../usuario.service';
import {perfilUsuario} from "../perfil";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {validarPassword} from "../../utils/validators-utils";
import {Router} from "@angular/router";

@Component({
  selector: 'app-datos-perfil',
  templateUrl: './datos-perfil.component.html',
  styleUrls: ['./datos-perfil.component.scss']
})
export class DetallesPerfilComponent {

  idUsuario: string = "";
  datosPerfil!: any;
  formulario!: FormGroup;
  submitted: any;

  public usernameInvalid = 'El nombre de usuario debe incluir: al menos una letra, y puede incluir letras, números, puntos, ' +
    'guiones bajos y guiones medios. Además, debe tener una longitud de 5 a 16 caracteres.'

  public emailInvalid = 'El correo electrónico debe tener un formato válido. Ejemplo: example@example.com'

  public passwordInvalid = String.raw`La contraseña debe tener al menos 8 caracteres e incluir al menos una letra mayúscula, una
  letra minúscula y un carácter especial como !@#$%^&*()\-=+_{};':"|,.<>?`;

  constructor(
    private perfilService: UsuariosService,
    private fb: FormBuilder,
    private router: Router,
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

  ngOnInit() {
    this.idUsuario = this.perfilService.obtenerIdUsuario();

    this.perfilService.perfil(this.idUsuario).subscribe((perfilUsuario: perfilUsuario[]) => {
      this.datosPerfil = perfilUsuario;
      this.editarPerfil()
    });
  }

  editarPerfil() {
    this.formulario.patchValue({
      username: this.datosPerfil.username,
      email: this.datosPerfil.email,
    })
  }

  putPerfil() {
    this.submitted = true; // Establecer submitted en true al intentar enviar el formulario
    if (this.formulario.invalid) {
      console.log(this.formulario.errors)
    } else {
      this.perfilService.putPerfil(this.idUsuario, this.formulario.value).subscribe(response => {
        if (response.status == 200) {
          localStorage.removeItem("userData");
          this.router.navigateByUrl("/login").then(r => {})
        }
      });
    }
  }

}

