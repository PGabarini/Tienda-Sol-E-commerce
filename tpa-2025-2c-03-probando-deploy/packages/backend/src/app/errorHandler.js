import {
  CambioDeEstadoInvalidoError, ConstructorFallidoError,
  ErrorDeDominio,
  NoEncontradoError,
  StockInsuficienteError, UsuarioYaCreadoError
} from '../exceptions/exceptions.js';
import z from "zod"

export default function errorHandler(err, req, res, _) {
  
  if (err instanceof z.ZodError || err?.name === "ZodError")  {
    return crearErrorZod(err,res)
  }
  
  if (err instanceof ErrorDeDominio) {
    return procesarErrorDeDomino(err, res)
  } 

    res.status(500).json({ error: 'Error interno del servidor' });
    console.error(`Error en request: ${req.url} con body: ${JSON.stringify(req.body)}: ${err.stack}`);
}

function procesarErrorDeDomino(err, res) {
  switch (err.constructor) {
    case NoEncontradoError:
      return res.status(404).json({ error: err.message });
    case StockInsuficienteError:
    case CambioDeEstadoInvalidoError:
    case UsuarioYaCreadoError:
      return res.status(409).json({ error: err.message });
    case ConstructorFallidoError:
      return res.status(400).json({ error: err.message });
  }}

function crearErrorZod(err,res){
    const issues = err.issues
    const detalles = issues.map(issue => {
      return {
        message: issue.message,
        code : issue.code
      };
    });

    return res.status(400).json({
      error: "Error de validación del contenido recibido",
      detalles: detalles
    });
  }
