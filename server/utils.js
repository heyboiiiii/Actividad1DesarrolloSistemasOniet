import fs from 'fs';

export function generarInformes(datos, rutaSalida = './data/informe.json') {

  // 1. Acumular totales por compañía
  const totales = new Map();

  for (const fila of datos) {
    const compania = fila.CompaniaSeguro;

    const valor = parseFloat(fila.ValorPorServicio) || 0;
    const cantidad = parseInt(fila.CantidadServicios, 10) || 0;
    const PorcentajeCobertura = parseFloat(fila.PorcentajeCobertura) || 0;
    const subtotal = valor * cantidad;
    const CoberturaCompaniaSeguro = subtotal * (PorcentajeCobertura / 100);

    const acumulado = totales.get(compania) || { facturado: 0, servicios: 0, totalCobertura: 0 };
    acumulado.facturado += subtotal;
    acumulado.servicios += cantidad;
    acumulado.totalCobertura += CoberturaCompaniaSeguro;

    totales.set(compania, acumulado);
  }

  // 2. Convertir a arreglo con la estructura pedida
  const informe = [...totales.entries()].map(([CompaniaSeguro, { facturado, servicios, totalCobertura }]) => ({
    CompaniaSeguro,
    TotalFacturado: Number(facturado.toFixed(2)),
    TotalServicios: servicios,
    TotalCobertura: Number(totalCobertura.toFixed(2)),
  }));

  // 3. Escribir el archivo
  fs.writeFileSync(rutaSalida, JSON.stringify(informe, null, 2), 'utf8');

  console.log('Informe generado en ./data/informe.json');

  return informe;
}