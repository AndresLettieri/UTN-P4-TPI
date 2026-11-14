import type { Pedido } from "../types/pedido";
import EstadoPedido from "./EstadoPedido";
import { useAuthStore } from "../../../store/authStore";
import { useCancelarPedido } from "../hooks/useCancelarPedido";
import { useCambiarEstadoPedido } from "../hooks/useCambiarEstadoPedido";

interface PedidoCardProps {
  pedido: Pedido;
  expandido: boolean;
  alternarDetalle: (pedidoId: number) => void;
}

const formatoPrecio = (precio: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(precio);

const formatoFecha = (fecha: string) =>
  new Date(fecha).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  

export default function PedidoCard({
  pedido,
  expandido,
  alternarDetalle,
}: PedidoCardProps) {

  const user = useAuthStore((state) => state.user);
  const esAdmin = user?.role === "admin";

  const cancelarMutation = useCancelarPedido();
  const cambiarEstadoMutation = useCambiarEstadoPedido();

  const puedeCancelar =
    pedido.estado === "PENDIENTE" ||
    (esAdmin && pedido.estado === "EN_PREPARACION");

  const puedeAvanzar =
    esAdmin &&
    (pedido.estado === "PENDIENTE" ||
      pedido.estado === "EN_PREP");

  const cancelar = () => {
    if (!window.confirm("¿Estás seguro de que querés cancelar este pedido?")) {
      return;
    }

    cancelarMutation.mutate(pedido.id);
  };

  const avanzarEstado = () => {
    const siguienteEstado =
      pedido.estado === "PENDIENTE" ? "EN_PREPARACION" : "ENTREGADO";

    if (!window.confirm(`¿Querés cambiar el estado del pedido a ${siguienteEstado}?`)) {
      return;
    }

    cambiarEstadoMutation.mutate(pedido.id);
  };

  return (
    <section className="overflow-hidden rounded-xl border border-brand-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-brand-800">
            Pedido #{pedido.id}
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            {formatoFecha(pedido.created_at)}
          </p>

          <div className="mt-2">
            <EstadoPedido estado={pedido.estado} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <p className="text-lg font-bold text-brand-700">
            {formatoPrecio(pedido.total)}
          </p>

          <button
            type="button"
            onClick={() => alternarDetalle(pedido.id)}
            className="cursor-pointer rounded-lg border border-brand-300 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            {expandido ? "Ocultar detalle" : "Ver detalle"}
          </button>
        </div>
      </div>

      {expandido && (
        <div className="border-t border-brand-100 bg-brand-50/40 p-5">
          <h3 className="mb-4 font-semibold text-brand-800">
            Productos del pedido
          </h3>

          <div className="space-y-3">
            {pedido.items.map((item, index) => (
              <div
                key={`${pedido.id}-${item.producto_id}-${index}`}
                className="flex justify-between gap-4 border-b border-brand-100 pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-zinc-800">
                    {item.nombre_producto}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    {item.cantidad} x {formatoPrecio(item.precio_unitario)}
                  </p>
                </div>

                <p className="shrink-0 font-semibold text-zinc-800">
                  {formatoPrecio(item.subtotal)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t border-brand-200 pt-4 text-sm">
            <p>
              <span className="font-medium text-zinc-700">
                Forma de pago:
              </span>{" "}
              {pedido.forma_pago}
            </p>

            <p>
              <span className="font-medium text-zinc-700">
                Dirección de entrega:
              </span>{" "}
              {pedido.direccion_entrega}
            </p>

            {pedido.notas && (
              <p>
                <span className="font-medium text-zinc-700">
                  Notas:
                </span>{" "}
                {pedido.notas}
              </p>
            )}
          </div>
          {(puedeCancelar || puedeAvanzar) && (
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              {puedeCancelar && (
                <button
                  onClick={cancelar}
                  disabled={cancelarMutation.isPending || cambiarEstadoMutation.isPending}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cancelarMutation.isPending ? "Cancelando..." : "Cancelar pedido"}
                </button>
              )}

              {puedeAvanzar && (
                <button
                  onClick={avanzarEstado}
                  disabled={cancelarMutation.isPending || cambiarEstadoMutation.isPending}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cambiarEstadoMutation.isPending
                    ? "Actualizando..."
                    : pedido.estado === "PENDIENTE"
                      ? "Pasar a preparación"
                      : "Marcar como entregado"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
