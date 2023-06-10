
export function url() {
  let PRE = "http://localhost:8000/"
  let PRO = "http://44.213.255.189/"
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

export function formatearFecha(fechaInicial: Date) {


  if (fechaInicial) {
    const fecha = new Date(fechaInicial);
    const year = fecha.getUTCFullYear();
    const month = String(fecha.getUTCMonth() + 1).padStart(2, "0");
    const day = String(fecha.getUTCDate() + 1).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return '';
}

