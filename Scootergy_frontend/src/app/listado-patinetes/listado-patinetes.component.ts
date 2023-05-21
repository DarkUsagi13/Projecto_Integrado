import {Component, OnInit} from '@angular/core';
import {PatinetesService} from "../patinetes.service";
import {PerfilService} from "../perfil.service";
import {Patinete} from "../patinete";

@Component({
  selector: 'app-listado-patinetes',
  templateUrl: './listado-patinetes.component.html',
  styleUrls: ['./listado-patinetes.component.scss']
})
export class ListadoPatinetesComponent implements OnInit{

  usuario: any;
  listaPatinetes: Patinete[] = [];

  constructor(
    private perfilService: PerfilService,
    private patinetesServices: PatinetesService,
  ) {
  }

  ngOnInit() {
    this.usuario = this.perfilService.obtenerIdUsuario()
    this.patinetesServices.patinetes(this.usuario).subscribe(patinetes => {
      this.listaPatinetes = patinetes;
    })
  }

}
