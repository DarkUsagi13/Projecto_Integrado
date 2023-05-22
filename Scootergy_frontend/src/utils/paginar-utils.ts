export function realizarPaginacion(items: any[], paginaActual: number, itemsPorPagina: number): any[] {
  const startIndex = (paginaActual - 1) * itemsPorPagina;
  const endIndex = startIndex + itemsPorPagina;
  return items.slice(startIndex, endIndex);
}
