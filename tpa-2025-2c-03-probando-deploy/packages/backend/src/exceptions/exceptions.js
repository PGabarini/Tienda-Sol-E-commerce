/**
 * @abstract
 * */
export class ErrorDeDominio extends Error {
  /**
   * @param {string} mensaje
   * */
  constructor(mensaje) {
    super(mensaje);
  }
}

export class NoEncontradoError extends ErrorDeDominio {
  /**
   * @param {string} mensaje
   * */
  constructor(mensaje) {
    super(mensaje);
  }
}

export class StockInsuficienteError extends ErrorDeDominio {
  /**
   * @param {String} producto
   */
  constructor(producto) {
    super(`No hay stock suficiente para el producto ${producto}`);
  }
}

export class CambioDeEstadoInvalidoError extends ErrorDeDominio {
  /**
   * @param {string} message
   * */
  constructor(message) {
    super(message);
  }
}

export class UsuarioYaCreadoError extends ErrorDeDominio {
  /**
   * @param {string} email
   */
  constructor(email) {
    super(`El usuario con email ${email} ya está registrado`);
  }
}

export class ConstructorFallidoError extends ErrorDeDominio {
  /**
   * @param {string} mensaje
   */
  constructor(mensaje) {
    super(mensaje);
  }
}