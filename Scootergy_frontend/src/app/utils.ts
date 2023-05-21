
export function url() {
  let PRE = "http://localhost:8000/"
  let PRO = "http://172.31.61.240/"
  return PRE
}

export function calcular_tiempo(conexion: any) {
  const fechaInicio = new Date(conexion.horaConexion);
  const fechaFin = new Date(conexion.horaDesconexion);

  const diferenciaEnMilisegundos = fechaFin.getTime() - fechaInicio.getTime();
  const horas = Math.floor(diferenciaEnMilisegundos / 3600000); // 1 hora = 3600000 milisegundos
  const minutos = Math.floor((diferenciaEnMilisegundos % 3600000) / 60000); // 1 minuto = 60000 milisegundos

  return { horas, minutos };
}
