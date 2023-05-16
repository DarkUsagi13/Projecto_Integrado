import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AutenticarService} from "../autenticar.service";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {

  public formulario!: FormGroup;
  public errores: any = {};

  constructor(
    private fb: FormBuilder,
    private autenticarService: AutenticarService,
  ) {
  }

  ngOnInit() {
    this.formulario = this.fb.group({
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    })
  }

  nuevoUsuario(formData: any) {
    if (this.formulario.invalid) {
      this.errores = {invalid:'Todos los campos son obligatorios'}
    } else {
      this.autenticarService.nuevoUsuario(this.formulario.value).subscribe({
        next: (data) => {
          this.autenticarService.logInUser(formData);
        },
        error: (error) => {
          this.errores = error.error;
          if (error.statusText == 'Unknown Error') {
            this.errores = {errorServer: 'No se ha podido conectar al servidor'}
          }
        }
      });
    }
  }

  protected readonly Object = Object;
}
