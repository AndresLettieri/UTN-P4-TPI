import { useCartStore } from "../../../store/cartStore";
import type { Producto } from "../../productos/types/producto";

interface ProductoCardProps {
  producto: Producto;
}

function ProductoCard({ producto }: ProductoCardProps) {
  const cantidad = useCartStore(
    (state) =>
      state.items.find((item) => item.producto_id === producto.id)
        ?.cantidad ?? 0
  );

  const agregarProducto = useCartStore(
    (state) => state.agregarProducto
  );

  const modificarCantidad = useCartStore(
    (state) => state.modificarCantidad
  );

  const agotado = producto.stock <= 0;
  const disponible = producto.disponible && !agotado;
  const puedeAgregar = disponible && cantidad < producto.stock;

  const incrementar = () => {
    if (puedeAgregar) {
      agregarProducto(producto.id, 1);
    }
  };

  const decrementar = () => {
    if (cantidad > 0) {
      modificarCantidad(producto.id, cantidad - 1);
    }
  };

  return (
    <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {producto.imagen_url ? (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          className="h-32 w-full object-cover"
        />
      ) : (
        <div className="flex h-32 items-center justify-center bg-gray-100 text-sm text-gray-400">
          Sin imagen
        </div>
      )}

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {producto.nombre}
        </h2>

        <p className="mt-2 min-h-4 text-sm text-gray-600">
          {producto.descripcion || "Sin descripción"}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ${producto.precio_base}
          </span>

          {!disponible && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
              {agotado ? "Agotado" : "No disponible"}
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Stock: {producto.stock}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={decrementar}
              disabled={cantidad === 0}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-lg font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Quitar una unidad de ${producto.nombre}`}
            >
              −
            </button>

            <span className="min-w-5 text-center font-semibold text-gray-900">
              {cantidad}
            </span>

            <button
              type="button"
              onClick={incrementar}
              disabled={!puedeAgregar}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-600 text-lg font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Agregar una unidad de ${producto.nombre}`}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductoCard;