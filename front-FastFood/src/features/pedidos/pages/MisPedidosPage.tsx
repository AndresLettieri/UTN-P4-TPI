import { useState } from "react";
import { usePedidos } from "../hooks/usePedidos";
import { Link } from "react-router-dom";
import PedidoCard from "../components/PedidoCard";



export default function MisPedidosPage() {
  const [pedidoExpandido, setPedidoExpandido] = useState<number | null>(null);

	const [pagina, setPagina] = useState(0);
	const PAGE_SIZE = 10;

	const { data, isLoading, isError, refetch } = usePedidos(
		pagina * PAGE_SIZE,
		PAGE_SIZE
	);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <p className="text-center text-zinc-500">
          Cargando tus pedidos...
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
          <p className="text-sm text-red-700">
            No se pudieron cargar tus pedidos.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  const pedidos = data?.items ?? [];

  if (pedidos.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-brand-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-brand-800">
            Mis pedidos
          </h1>

          <p className="mt-3 text-sm text-zinc-500">
            Todavía no realizaste ningún pedido.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Ir al catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Food Store
        </p>

        <h1 className="mt-1 text-3xl font-bold text-brand-800">
          Mis pedidos
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Consultá tus compras y el detalle de cada pedido.
        </p>
      </div>

      <div className="space-y-4">
        {pedidos.map((pedido) => {
          const expandido = pedidoExpandido === pedido.id;
          return (
            <PedidoCard
							key={pedido.id}
              pedido={pedido}
              expandido={expandido}
              alternarDetalle={(pedidoId) =>
                setPedidoExpandido((actual) =>
                  actual === pedidoId ? null : pedidoId
                )
              }
            />
          );
        })}
      </div>
			{data && data.total > PAGE_SIZE && (
				<div className="mt-8 flex items-center justify-between border-t border-brand-100 pt-5">
					<button
						type="button"
						onClick={() => setPagina((actual) => actual - 1)}
						disabled={pagina === 0}
						className="rounded-lg border border-brand-300 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
					>
						Anterior
					</button>

					<span className="text-sm text-zinc-500">
						Página {pagina + 1} de {Math.ceil(data.total / PAGE_SIZE)}
					</span>

					<button
						type="button"
						onClick={() => setPagina((actual) => actual + 1)}
						disabled={(pagina + 1) * PAGE_SIZE >= data.total}
						className="rounded-lg border border-brand-300 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
					>
						Siguiente
					</button>
				</div>
			)}
    </main>
  );
}