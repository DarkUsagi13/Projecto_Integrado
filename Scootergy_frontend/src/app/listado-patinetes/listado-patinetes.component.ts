import {Component, OnInit} from '@angular/core';
import {PatinetesService} from "../patinetes.service";
import {PerfilService} from "../perfil.service";
import {Patinete} from "../patinete";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-listado-patinetes',
  templateUrl: './listado-patinetes.component.html',
  styleUrls: ['./listado-patinetes.component.scss']
})
export class ListadoPatinetesComponent implements OnInit{

  usuario: any;
  listaPatinetes: Patinete[] = [];
  valoresForm!: FormGroup;
  filtros: any = {};

  constructor(
    private perfilService: PerfilService,
    private patinetesServices: PatinetesService,
    private fb: FormBuilder,
  ) {
    this.filtros = {
      1: 'ID',
      2: 'Marca',
      3: 'Modelo',
      4: 'Consumo',
    };
  }

  ngOnInit() {

    this.valoresForm = this.fb.group({
      filtros: new FormControl('1'),
      orden: new FormControl('Ascendente'),
    });

    this.usuario = this.perfilService.obtenerIdUsuario()
    this.patinetesServices.patinetes(this.usuario).subscribe(patinetes => {
      this.listaPatinetes = patinetes;
    })
  }

}
