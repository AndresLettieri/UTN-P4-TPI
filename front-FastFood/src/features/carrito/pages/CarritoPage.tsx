import { Link, useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";

import { useCartStore } from "../../../store/cartStore";
import { obtenerProductoPorId } from "../../productos/services/productos";
import ItemPedidoCard from "../components/ItemPedidoCard";

const formatoPrecio = (precio: number) =>
  precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

function CarritoPage() {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const modificarCantidad = useCartStore(
    (state) => state.modificarCantidad
  );
  const quitarProducto = useCartStore(
    (state) => state.quitarProducto
  );
  const vaciarCarrito = useCartStore(
    (state) => state.vaciarCarrito
  );

  const productosQueries = useQueries({
    queries: items.map((item) => ({
      queryKey: ["productos", item.producto_id],
      queryFn: () => obtenerProductoPorId(item.producto_id),
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

  const tieneProblemas = productos.some(
    ({ producto, isLoading, isError, cantidad }) =>
      isLoading ||
      isError ||
      !producto ||
      !producto.activo ||
      !producto.disponible ||
      producto.stock < cantidad
  );

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Tu carrito está vacío
          </h1>

          <p className="mt-3 text-gray-500">
            Todavía no agregaste productos a tu carrito.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-md bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700"
          >
            Ir al catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Mi carrito
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Revisá los productos antes de continuar.
          </p>
        </div>

        <button
          type="button"
          onClick={vaciarCarrito}
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="space-y-4">
        {productos.map(
          ({ producto, producto_id, cantidad, isLoading, isError }) => (
             <ItemPedidoCard
              key={producto_id}
              producto_id={producto_id}
              cantidad={cantidad}
              producto={producto}
              isLoading={isLoading}
              isError={isError}
              modificarCantidad={modificarCantidad}
              quitarProducto={quitarProducto}
            />
          )
        )}
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            Total estimado
          </span>

          <span className="text-2xl font-bold text-gray-900">
            {formatoPrecio(total)}
          </span>
        </div>

        {tieneProblemas && (
          <p className="mt-3 text-sm text-red-600">
            Revisá los productos del carrito antes de continuar con la compra.
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            disabled={tieneProblemas}
            onClick={() => navigate("/checkout")}
            className="cursor-pointer rounded-md bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continuar con la compra
          </button>
        </div>
      </div>
    </main>
  );
}

export default CarritoPage;