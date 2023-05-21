import { Component, OnInit } from '@angular/core';
import { ConexionesService } from "../conexiones.service";
import { PerfilService } from "../perfil.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-historial-conexiones',
  templateUrl: './historial-conexiones.component.html',
  styleUrls: ['./historial-conexiones.component.scss']
})
export class HistorialConexionesComponent implements OnInit {
  conexiones: any = {};
  valores: any = {};
  valoresForm!: FormGroup;
  conexionesOrdenadas: any = {};
  paginaActual = 1; // Página actual

  constructor(
    private perfilService: PerfilService,
    private conexionesService: ConexionesService,
    private fb: FormBuilder,
  ) {
    this.valores = {
      1: 'Patinete',
      2: 'Puesto',
      3: 'Consumo',
      4: 'Hora de conexión',
      5: 'Hora de Desconexión',
      6: 'Importe'
    };
  }

  ngOnInit() {
    this.valoresForm = this.fb.group({
      orden: new FormControl('4'), // Establece la opción predeterminada como 'Hora de conexión'
    });
    this.getConexiones();
  }

  cambiarPagina(delta: number) {
    const totalPages = 10; // Establece el número total de páginas

    const newPage = this.paginaActual + delta;

    if (newPage >= 1 && newPage <= totalPages) {
      this.paginaActual = newPage;
      this.getConexiones();
    }
  }


  getConexiones() {
    const userId = this.perfilService.getLoggedInUser();

    this.conexionesService.getConexionesFinalizadas(userId, this.paginaActual).subscribe(conexiones => {
      this.conexiones = conexiones.results;
      console.log(this.conexiones)
      this.ordenarHistorial();
    });
  }


  ordenarHistorial() {
    const propiedadOrden = parseInt(this.valoresForm.get('orden')?.value, 10);

    const compararPropiedad = (a: any, b: any, propiedad: string | number) => {
      const valorA = a[propiedad];
      const valorB = b[propiedad];
      if (valorA < valorB) {
        return -1;
      }
      if (valorA > valorB) {
        return 1;
      }
      return 0;
    };

    if (propiedadOrden === 1) {
      this.conexionesOrdenadas = this.conexiones.sort((a: { patineteNombre: string }, b: { patineteNombre: string }) =>
        compararPropiedad(a, b, 'patineteNombre')
      );
    } else if (propiedadOrden === 2) {
      this.conexionesOrdenadas = this.conexiones.sort((a: { datosPuesto: { id: number } }, b: { datosPuesto: { id: number } }) =>
        a.datosPuesto.id - b.datosPuesto.id
      );
    } else if (propiedadOrden === 3) {
      this.conexionesOrdenadas = this.conexiones.sort((a: { consumo: number }, b: { consumo: number }) =>
        a.consumo - b.consumo
      );
    } else if (propiedadOrden === 4) {
      this.conexionesOrdenadas = this.conexiones.sort((a: { horaConexion: string | number }, b: { horaConexion: string | number }) =>
        compararPropiedad(a, b, 'horaConexion')
      );
    } else if (propiedadOrden === 5) {
      this.conexionesOrdenadas = this.conexiones.sort((a: { horaDesconexion: string | number }, b: { horaDesconexion: string | number }) =>
        compararPropiedad(a, b, 'horaDesconexion')
      );
    } else if (propiedadOrden === 6) {
      this.conexionesOrdenadas = this.conexiones.sort((a: { monto: number }, b: { monto: number }) =>
        a.monto - b.monto
      );
    }
  }
}
