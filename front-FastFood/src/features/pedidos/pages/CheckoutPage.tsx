import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";

import { useCartStore } from "../../../store/cartStore";
import { obtenerProductoPorId } from "../../productos/services/productos";
import { useFormasPago } from "../hooks/useFormasPago";
import { useCrearPedido } from "../hooks/useCrearPedido";
import type { PedidoCreate } from "../types/pedido";
import MensajeModal from "../../../components/MensajeModal";

const formatoPrecio = (precio: number) =>
  precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

function CheckoutPage() {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const vaciarCarrito = useCartStore((state) => state.vaciarCarrito);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  
  const {
    data: formasPago = [],
    isLoading: isLoadingFormasPago,
    isError: isErrorFormasPago,
  } = useFormasPago();

  const crearPedidoMutation = useCrearPedido();

  const [formaPago, setFormaPago] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");

  const productosQueries = useQueries({
    queries: items.map((item) => ({
      queryKey: ["productos", item.producto_id],
      queryFn: () => obtenerProductoPorId(item.producto_id),
      enabled:
        Number.isInteger(item.producto_id) && item.producto_id > 0,
    })),
  });

  const productos = items.map((item, index) => ({
    ...item,
    producto: productosQueries[index].data,
    isLoading: productosQueries[index].isLoading,
    isError: productosQueries[index].isError,
  }));

  const total = productos.reduce(
    (acumulado, item) =>
      acumulado +
      (item.producto
        ? item.producto.precio_base * item.cantidad
        : 0),
    0
  );

  const productosCargando = productos.some(
    (item) => item.isLoading
  );

  const tieneProblemas = productos.some(
    ({ producto, producto_id, cantidad, isError }) =>
      !Number.isInteger(producto_id) ||
      producto_id <= 0 ||
      isError ||
      !producto ||
      !producto.activo ||
      !producto.disponible ||
      producto.stock < cantidad
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const pedido: PedidoCreate = {
      forma_pago: formaPago,
      direccion_entrega: direccion.trim(),
      notas: notas.trim() || null,
      items: items.map((item) => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
      })),
    };

    crearPedidoMutation.mutate(pedido, {
      onSuccess: () => {
        vaciarCarrito();
        setMostrarModalExito(true);
      },
    });
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

  if (items.length === 0 && !mostrarModalExito) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-brand-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.7}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l2.4 12.2a2 2 0 002 1.6h8.8a2 2 0 002-1.6L22 8H6"
              />
              <circle cx="10" cy="21" r="1" />
              <circle cx="18" cy="21" r="1" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-brand-700">
            Finalizar compra
          </h1>

          <p className="mt-2 text-sm text-zinc-600">
            No tenés productos en el carrito.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Volver al catálogo
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
          Finalizar compra
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Completá los datos para confirmar tu pedido.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos de entrega */}
        <section className="overflow-hidden rounded-xl border border-brand-200 bg-white shadow-sm">
          <div className="border-b border-brand-100 bg-brand-50/70 px-5 py-4">
            <h2 className="font-semibold text-brand-800">
              01. Datos de entrega
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Indicá dónde querés recibir tu pedido.
            </p>
          </div>

          <div className="space-y-4 p-5">
            <div>
              <label
                htmlFor="direccion"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Dirección de entrega
              </label>

              <input
                id="direccion"
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                minLength={5}
                maxLength={200}
                required
                className={inputClass}
                placeholder="Ingresá tu dirección"
              />
            </div>

            <div>
              <label
                htmlFor="notas"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Notas adicionales
                <span className="ml-1 font-normal text-zinc-400">
                  (opcional)
                </span>
              </label>

              <textarea
                id="notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className={inputClass}
                rows={3}
                placeholder="Indicaciones para la entrega..."
              />
            </div>
          </div>
        </section>

        {/* Forma de pago */}
        <section className="overflow-hidden rounded-xl border border-brand-200 bg-white shadow-sm">
          <div className="border-b border-brand-100 bg-brand-50/70 px-5 py-4">
            <h2 className="font-semibold text-brand-800">
              02. Forma de pago
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Seleccioná cómo vas a realizar el pago.
            </p>
          </div>

          <div className="p-5">
            {isLoadingFormasPago && (
              <p className="text-sm text-zinc-500">
                Cargando formas de pago...
              </p>
            )}

            {isErrorFormasPago && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                No se pudieron cargar las formas de pago.
              </p>
            )}

            {!isLoadingFormasPago && !isErrorFormasPago && (
              <select
                value={formaPago}
                onChange={(e) => setFormaPago(e.target.value)}
                required
                className={inputClass}
              >
                <option value="">Seleccionar forma de pago</option>

                {formasPago.map((forma) => (
                  <option key={forma.codigo} value={forma.codigo}>
                    {forma.descripcion}
                  </option>
                ))}
              </select>
            )}
          </div>
        </section>

        {/* Resumen del pedido */}
        <section className="overflow-hidden rounded-xl border border-brand-200 bg-white shadow-sm">
          <div className="border-b border-brand-100 bg-brand-50/70 px-5 py-4">
            <h2 className="font-semibold text-brand-800">
              03. Resumen del pedido
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Revisá los productos antes de confirmar.
            </p>
          </div>

          <div className="p-5">
            <div className="space-y-4">
              {productos.map(
                ({ producto, producto_id, cantidad, isLoading, isError }) => (
                  <div
                    key={producto_id}
                    className="flex justify-between gap-4 border-b border-zinc-100 pb-4 last:border-0"
                  >
                    <div className="min-w-0">
                      {isLoading ? (
                        <p className="text-sm text-zinc-500">
                          Cargando producto...
                        </p>
                      ) : isError || !producto ? (
                        <p className="text-sm text-red-600">
                          Producto no disponible (ID: {producto_id})
                        </p>
                      ) : (
                        <>
                          <p className="font-medium text-zinc-800">
                            {producto.nombre}
                          </p>

                          <p className="mt-1 text-sm text-zinc-500">
                            {cantidad} x{" "}
                            {formatoPrecio(producto.precio_base)}
                          </p>

                          {(!producto.activo || !producto.disponible) && (
                            <p className="mt-1 text-xs font-medium text-red-600">
                              Producto no disponible.
                            </p>
                          )}

                          {producto.stock < cantidad && (
                            <p className="mt-1 text-xs font-medium text-red-600">
                              Stock insuficiente. Disponibles:{" "}
                              {producto.stock}.
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {producto && (
                      <p className="shrink-0 font-semibold text-zinc-800">
                        {formatoPrecio(
                          producto.precio_base * cantidad
                        )}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg bg-brand-50 px-4 py-4">
              <span className="font-semibold text-brand-800">
                Total estimado
              </span>
              <span className="text-xl font-bold text-brand-700">
                {formatoPrecio(total)}
              </span>
            </div>

            <p className="mt-2 text-xs text-zinc-400">
              El importe definitivo será calculado al confirmar el pedido.
            </p>
          </div>
        </section>

        {/* Mensajes */}
        {tieneProblemas && (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Hay productos que necesitan revisión antes de confirmar el pedido.
          </p>
        )}

        {crearPedidoMutation.isError && (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            No se pudo crear el pedido. Verificá los datos e intentá nuevamente.
          </p>
        )}

        {/* Acciones */}
        <div className="flex flex-col-reverse justify-between gap-3 border-t border-brand-100 pt-5 sm:flex-row">
          <Link
            to="/carrito"
            className="inline-flex items-center justify-center rounded-lg border border-brand-300 px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Volver al carrito
          </Link>

          <button
            type="submit"
            disabled={
              crearPedidoMutation.isPending ||
              isLoadingFormasPago ||
              isErrorFormasPago ||
              formasPago.length === 0 ||
              !formaPago ||
              productosCargando ||
              tieneProblemas
            }
            className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {crearPedidoMutation.isPending
              ? "Procesando..."
              : "Confirmar pedido"}
          </button>
        </div>
      </form>
      {mostrarModalExito && (
        <MensajeModal
          titulo="¡Pedido realizado!"
          mensaje="Tu pedido se creó correctamente. Podés consultar su estado desde la sección Mis pedidos."
          tipo="exito"
          onCerrar={() => navigate("/mis-pedidos", { replace: true })}
        />
      )}
    </main>
  );
}

export default CheckoutPage;
