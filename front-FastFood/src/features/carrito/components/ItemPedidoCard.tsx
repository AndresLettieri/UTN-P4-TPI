import type { Producto } from "../../productos/types/producto";

interface ItemPedidoCardProps {
  producto_id: number;
  cantidad: number;
  producto?: Producto;
  isLoading: boolean;
  isError: boolean;
  modificarCantidad: (productoId: number, cantidad: number) => void;
  quitarProducto: (productoId: number) => void;
}

const formatoPrecio = (precio: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(precio);

export default function ItemPedidoCard({
  producto_id,
  cantidad,
  producto,
  isLoading,
  isError,
  modificarCantidad,
  quitarProducto,
}: ItemPedidoCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      {isLoading ? (
        <p className="flex-1 text-sm text-gray-500">
          Cargando producto...
        </p>
      ) : isError || !producto ? (
        <div className="flex-1">
          <p className="font-semibold text-gray-900">
            Producto no disponible
          </p>

          <p className="mt-1 text-sm text-red-600">
            No se pudo recuperar este producto.
          </p>
        </div>
      ) : (
        <>
          {producto.imagen_url ? (
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              className="h-24 w-full rounded-md object-cover sm:w-28"
            />
          ) : (
            <div className="flex h-24 w-full items-center justify-center rounded-md bg-gray-100 text-sm text-gray-400 sm:w-28">
              Sin imagen
            </div>
          )}

          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">
              {producto.nombre}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {formatoPrecio(producto.precio_base)} por unidad
            </p>

            {!producto.activo || !producto.disponible ? (
              <p className="mt-2 text-sm text-red-600">
                Producto no disponible.
              </p>
            ) : producto.stock < cantidad ? (
              <p className="mt-2 text-sm text-red-600">
                Stock insuficiente. Disponibles: {producto.stock}.
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  modificarCantidad(producto_id, cantidad - 1)
                }
                disabled={cantidad <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 disabled:opacity-40"
                aria-label={`Quitar una unidad de ${producto.nombre}`}
              >
                −
              </button>

              <span className="min-w-5 text-center font-semibold">
                {cantidad}
              </span>

              <button
                type="button"
                onClick={() =>
                  modificarCantidad(producto_id, cantidad + 1)
                }
                disabled={
                  !producto.activo ||
                  !producto.disponible ||
                  cantidad >= producto.stock
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 disabled:opacity-40"
                aria-label={`Agregar una unidad de ${producto.nombre}`}
              >
                +
              </button>
            </div>

            <p className="font-semibold text-gray-900">
              {formatoPrecio(producto.precio_base * cantidad)}
            </p>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => quitarProducto(producto_id)}
        className="text-left text-sm text-red-600 hover:text-red-700 sm:text-right"
      >
        Quitar
      </button>
    </article>
  );
}
