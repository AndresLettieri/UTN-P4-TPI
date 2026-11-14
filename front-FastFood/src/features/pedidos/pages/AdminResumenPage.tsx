import { useResumenPedidos } from "../hooks/useResumenPedidos";

const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

export default function AdminResumenPage() {
  const { data, isLoading, isError, refetch } = useResumenPedidos();

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <h1 className="text-2xl font-semibold">Resumen de pedidos</h1>
        <p className="mt-4 text-sm text-zinc-500">
          Cargando indicadores...
        </p>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <h1 className="text-2xl font-semibold">Resumen de pedidos</h1>
        <p className="mt-4 text-sm text-red-600">
          No se pudo cargar el resumen de pedidos.
        </p>
        <button
          onClick={() => void refetch()}
          className="mt-3 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700"
        >
          Reintentar
        </button>
      </main>
    );
  }

  const indicadores = [
    { titulo: "Pendientes", valor: data.pendientes },
    { titulo: "En preparación", valor: data.en_preparacion },
    { titulo: "Entregados", valor: data.entregados },
    { titulo: "Cancelados", valor: data.cancelados },
    { titulo: "Pedidos de hoy", valor: data.pedidos_hoy },
    {
      titulo: "Ingresos entregados",
      valor: formatoMoneda.format(data.ingresos_entregados),
    },
  ];

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Resumen general de pedidos.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {indicadores.map((indicador) => (
          <article
            key={indicador.titulo}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-zinc-500">
              {indicador.titulo}
            </p>
            <p className="mt-3 text-3xl font-semibold text-zinc-900">
              {indicador.valor}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
