import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AutenticarService} from "../autenticar.service";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  public formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private autenticarService: AutenticarService,
  ) {
  }

  ngOnInit() {
    this.formulario = this.fb.group({
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
    })
  }

  nuevoUsuario(formData: any) {
    console.log(formData)
    this.autenticarService.nuevoUsuario(this.formulario.value).subscribe(data => {
      this.autenticarService.logInUser(formData);
    });
  }

}
