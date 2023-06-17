export class Conexion {

  constructor(
    public puesto: any,
    public patinete: any,
    public usuario: any,
    public horaDesconexion: any,
    public importe: any,
    public consumo: any,
    public finalizada: any,
  ) {
  }

}

export class ConexionMasTiempo extends Conexion {
  public tiempoTotal: any;

  constructor(
    puesto: any,
    patinete: any,
    usuario: any,
    horaDesconexion: any,
    importe: any,
    consumo: any,
    finalizada: any,
    tiempoTotal: any,
  ) {
    super(puesto, patinete, usuario, horaDesconexion, importe, consumo, finalizada);
    this.tiempoTotal = tiempoTotal;
  }
}
