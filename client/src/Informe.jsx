import { useMemo } from "react";

// Formateador de moneda
const fmt = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

const fmtNum = new Intl.NumberFormat("es-AR");

export default function Informe({ informe: data }) {
  const porCobertura = useMemo(
    () => [...data].sort((a, b) => b.TotalCobertura - a.TotalCobertura),
    []
  );

  const porServicios = useMemo(
    () => [...data].sort((a, b) => b.TotalServicios - a.TotalServicios),
    []
  );

  return (
    <div className="p-6 grid gap-8 lg:grid-cols-2">
      <Tabla
        titulo="Compañías por Total de Cobertura"
        filas={porCobertura}
        columnaOrden="TotalCobertura"
        // Totales relevantes para esta tabla
        totales={[
          { label: "Total Facturado", key: "TotalFacturado", formato: "moneda" },
          { label: "Total Cobertura", key: "TotalCobertura", formato: "moneda" },
        ]}
      />
      <Tabla
        titulo="Compañías por Cantidad de Servicios"
        filas={porServicios}
        columnaOrden="TotalServicios"
        // Total relevante para esta tabla
        totales={[
          { label: "Total Servicios", key: "TotalServicios", formato: "numero" },
        ]}
      />
    </div>
  );
}

function Tabla({ titulo, filas, columnaOrden, totales = [] }) {
  // Calculamos la suma de cada métrica pedida
  const sumas = useMemo(() => {
    return totales.reduce((acc, t) => {
      acc[t.key] = filas.reduce((s, f) => s + (f[t.key] || 0), 0);
      return acc;
    }, {});
  }, [filas, totales]);

  const renderValor = (valor, formato) =>
    formato === "moneda" ? fmt.format(valor) : fmtNum.format(valor);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <h2 className="text-lg font-semibold text-gray-800 px-4 py-3 bg-gray-50 border-b">
        {titulo}
      </h2>

      {/* Bloque de resumen (KPI cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50/50">
        {totales.map((t) => (
          <div
            key={t.key}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2"
          >
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {t.label}
            </p>
            <p className="text-lg font-semibold text-indigo-600">
              {renderValor(sumas[t.key], t.formato)}
            </p>
          </div>
        ))}
      </div>

      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Compañía</th>
            <th className="px-4 py-2 text-right">Total Facturado</th>
            <th className="px-4 py-2 text-right">Servicios</th>
            <th className="px-4 py-2 text-right">Cobertura</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filas.map((row, i) => (
            <tr key={row.CompaniaSeguro} className="hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-500">{i + 1}</td>
              <td className="px-4 py-2 font-semibold text-gray-800">
                {row.CompaniaSeguro}
              </td>
              <td className="px-4 py-2 text-right">{fmt.format(row.TotalFacturado)}</td>
              <td
                className={`px-4 py-2 text-right ${
                  columnaOrden === "TotalServicios"
                    ? "font-bold text-indigo-600"
                    : ""
                }`}
              >
                {fmtNum.format(row.TotalServicios)}
              </td>
              <td
                className={`px-4 py-2 text-right ${
                  columnaOrden === "TotalCobertura"
                    ? "font-bold text-indigo-600"
                    : ""
                }`}
              >
                {fmt.format(row.TotalCobertura)}
              </td>
            </tr>
          ))}
        </tbody>

        {/* Fila de totales al pie */}
        <tfoot className="bg-gray-50 border-t-2 border-gray-200">
          <tr>
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2 font-bold text-gray-800">TOTAL</td>

            {/* Total Facturado */}
            <td className="px-4 py-2 text-right font-semibold">
              {fmt.format(filas.reduce((s, f) => s + f.TotalFacturado, 0))}
            </td>

            {/* Total Servicios */}
            <td
              className={`px-4 py-2 text-right font-semibold ${
                columnaOrden === "TotalServicios" ? "text-indigo-700" : ""
              }`}
            >
              {fmtNum.format(filas.reduce((s, f) => s + f.TotalServicios, 0))}
            </td>

            {/* Total Cobertura */}
            <td
              className={`px-4 py-2 text-right font-semibold ${
                columnaOrden === "TotalCobertura" ? "text-indigo-700" : ""
              }`}
            >
              {fmt.format(filas.reduce((s, f) => s + f.TotalCobertura, 0))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}