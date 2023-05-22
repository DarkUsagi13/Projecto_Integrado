export function realizarPaginacion(items: any[], paginaActual: number, itemsPorPagina: number): any[] {
  const startIndex = (paginaActual - 1) * itemsPorPagina;
  const endIndex = startIndex + itemsPorPagina;
  return items.slice(startIndex, endIndex);
}

export function comparePropertyString(a: any, b: any, property: string): number {
  const valueA = a[property];
  const valueB = b[property];

  if (valueA < valueB) {
    return -1;
  }
  if (valueA > valueB) {
    return 1;
  }
  return 0;
}

export function comparePropertyNumber(a: any, b: any, property: string): number {
  return a[property] - b[property];
}

