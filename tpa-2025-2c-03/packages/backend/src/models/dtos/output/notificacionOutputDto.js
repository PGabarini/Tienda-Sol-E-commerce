export default class NotificacionOutputDTO {
  constructor(notificacion) {
    this.id = notificacion.id.toString();
    this.usuarioDestino = notificacion.usuarioDestino.toString();
    this.mensaje = notificacion.mensaje;
    this.fueLeida = notificacion.fueLeida;
    this.fechaAlta =  notificacion.fechaAlta
  }
}