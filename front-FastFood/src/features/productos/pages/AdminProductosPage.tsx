import { useState } from "react";
import MensajeModal from "../../../components/MensajeModal";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "../../../store/authStore";

import ProductoList from "../components/ProductoList";
import FormProductoModal from "../components/ProductoModal";
import type {
  Producto,
  ProductoFormValues,
} from "../types/producto";

import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  desactivarProducto,
} from "../services/productos";

import { obtenerCategorias } from "../../categorias/services/categorias";

function ProductosPage() {
  const [modalAbierto, setModalAbierto] = useState(false);

  const [mensaje, setMensaje] = useState<{
    titulo: string;
    mensaje: string;
    tipo: "error" | "exito" | "advertencia";
  } | null>(null);

  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | undefined>(undefined);

  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "productos",
      pagination.pageIndex,
      pagination.pageSize,
    ],
    queryFn: () =>
      obtenerProductos({
        skip: pagination.pageIndex * pagination.pageSize,
        limit: pagination.pageSize,
      }),
  });

  const productos = data?.productos ?? [];
  const total = data?.total ?? 0;

  const { data: CategoriasData } = useQuery({
      queryKey: ["categorias"],
      queryFn: () => obtenerCategorias({ skip: 0, limit: 100 }),
  });

  const categorias = CategoriasData?.categorias ?? [];

  const crearProductoMutation  = useMutation({
    mutationFn: crearProducto,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["productos"],
            });

            setMensaje({
              titulo: "Operación exitosa",
              mensaje: "El producto se creó correctamente.",
              tipo: "exito",
            });
            cerrarModal();
        },

        onError: (error) => {
            setMensaje({
              titulo: "No se pudo crear el producto",
              mensaje: error.message,
              tipo: "error",
            });
        },
  });

  const actualizarProductoMutation = useMutation({
    mutationFn: async ({
      id,
      producto,
    }: {
      id: number;
      producto: ProductoFormValues;
    }) => {
      return actualizarProducto({ id, producto });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      setMensaje({
        titulo: "Operación exitosa",
        mensaje: "El producto se actualizó correctamente.",
        tipo: "exito",
      });
      cerrarModal();
    },
    onError: (error) => {
      setMensaje({
        titulo: "No se pudo actualizar el producto",
        mensaje: error.message,
        tipo: "error",
      });
    },
  });

  const desactivarProductoMutation = useMutation({
    mutationFn: async (id: number) => {
      return desactivarProducto(id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      setMensaje({
        titulo: "Operación exitosa",
        mensaje: "El producto se desactivó correctamente.",
        tipo: "exito",
      });
    },
    onError: (error) => {
      setMensaje({
        titulo: "No se pudo desactivar el producto",
        mensaje: error.message,
        tipo: "error",
      });
    },
  });

  const abrirNuevoProducto = () => {
    setProductoSeleccionado(undefined);
    setModalAbierto(true);
  };

  const editarProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(undefined);
  };

  const guardarProducto = (valores: ProductoFormValues) => {
    if (productoSeleccionado) {
      actualizarProductoMutation.mutate({
        id: productoSeleccionado.id,
        producto: valores,
      });
    } else {
      crearProductoMutation.mutate(valores);
    }
  };

  const handleDesactivar = (id: number) => {
    if (confirm("¿Estás seguro de que deseas desactivar este producto?")) {
      desactivarProductoMutation.mutate(id);
    }
  };


  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-gray-600">Cargando productos...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-red-500">
          Error al cargar los productos.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black">
          Productos
        </h1>
        {isAdmin && (
          <button
            type="button"
            onClick={abrirNuevoProducto}
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          >
            + Añadir producto
          </button>
        )}
      </div>

    <ProductoList
      productos={productos}
      total={total}
      pagination={pagination}
      onPaginationChange={setPagination}
      onEditar={editarProducto}
      onDesactivar={handleDesactivar}
    />

      {modalAbierto && (
        <FormProductoModal
          abierto={modalAbierto}
          producto={productoSeleccionado}
          categorias={categorias}
          onCerrar={cerrarModal}
          onSubmit={guardarProducto}
        />
      )}
      {mensaje && (
        <MensajeModal
          titulo={mensaje.titulo}
          mensaje={mensaje.mensaje}
          tipo={mensaje.tipo}
          onCerrar={() => setMensaje(null)}
        />
      )}
    </main>
  );
}

export default ProductosPage;
