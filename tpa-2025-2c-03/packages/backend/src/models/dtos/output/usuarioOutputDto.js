export default class UsuarioOutputDTO {
  constructor(usuario) {
    this.id = usuario.id.toString();
    this.nombre = usuario.nombre;
    this.email = usuario.email;
    this.telefono = usuario.telefono;
    this.tipo = usuario.tipo;
    this.fechaDeAlta = usuario.fechaAlta;
  }
}