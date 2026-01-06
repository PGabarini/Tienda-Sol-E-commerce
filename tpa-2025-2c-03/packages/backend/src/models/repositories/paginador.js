export default function crearPaginador(pagina, limite) {
  return {
    offset: {$skip: (pagina - 1) * limite},
    limit: {$limit: limite}
  }
}