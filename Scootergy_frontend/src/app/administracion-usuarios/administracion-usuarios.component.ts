import {Component, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {BusquedasService} from "../busquedas.service";
import {realizarPaginacion} from "../../utils/paginar-utils";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  AdministracionDetallesUsuarioComponent
} from "../administracion-detalles-usuario/administracion-detalles-usuario.component";
import {set} from "lodash";

@Component({
  selector: 'app-administracion-usuarios',
  templateUrl: './administracion-usuarios.component.html',
  styleUrls: ['./administracion-usuarios.component.scss']
})
export class AdministracionUsuariosComponent {
  formularioBusquedas!: FormGroup;
  valorBusqueda: string = '';
  filtroBusqueda: any = '';
  ordenBusqueda: any = '';
  usuarios: any = {}

  usuariosPaginados: any[] = [];


  paginaActual = 1; // Página actual
  itemsPorPagina = 10; // Cantidad de elementos por página
  totalUsuarios = 0; // Total de conexiones

  animacionCargando = true;
  usuarioEditadoId: string = '';

  constructor(
    private busquedaService: BusquedasService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {

    this.filtroBusqueda = {
      'username': 'Nombre de usuario',
      'date_joined': 'Fecha de alta',
    }

    this.ordenBusqueda = {
      '': 'Ascendiente',
      '-': 'Descendiente',
    }

    this.formularioBusquedas = this.fb.group({
      barraBusqueda: [''],
      filtroBusqueda: ['id'],
      ordenBusqueda: [' '],
    })
  }

  ngOnInit() {

    this.formularioBusquedas.valueChanges.subscribe(valores => {
        this.valorBusqueda = valores;
        this.buscarUsuarios();
      }
    )

    this.buscarUsuarios();

  }

  buscarUsuarios() {
    const valor = this.formularioBusquedas.get('barraBusqueda')?.value
    const orden = this.formularioBusquedas.get('ordenBusqueda')?.value
    const filtro = this.formularioBusquedas.get('filtroBusqueda')?.value
    this.busquedaService.buscarUsuarios(valor, orden, filtro).subscribe(usuarios => {
      if (usuarios.status == 200) {
        this.usuarios = usuarios.body;
        this.totalUsuarios = usuarios.body.length;
        this.usuariosPaginados = realizarPaginacion(this.usuarios, this.paginaActual, this.itemsPorPagina);
        this.animacionCargando = false;
      }
    })
  }

  open(usuario: any) {
    let modalRef = this.modalService.open(AdministracionDetallesUsuarioComponent)
    modalRef.componentInstance.usuario = usuario;

    modalRef.componentInstance.usuarioActualizado.subscribe((data: boolean) => {
      this.animacionCargando = true;
      if (data) {
        setTimeout(() => {
          this.buscarUsuarios();
          this.animacionCargando = false;
          this.usuarioEditadoId = usuario.id;
        }, 1000)
      }
    });

  }

}
