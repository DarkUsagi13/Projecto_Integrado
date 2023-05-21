export class Puesto {

  constructor(
    public id: string,
    public estacion: number,
    public disponible: boolean,
    public url: string,
    public datosPuesto: any,
    public perteneceUsuario: boolean = false,
  ) {
  }

}
