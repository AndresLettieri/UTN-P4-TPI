import { useState } from "react";
import MensajeModal from "../../../components/MensajeModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";
import { useAuthStore } from "../../../store/authStore";
import CategoriaList from "../components/CategoriaList";
import { FormCategoriaModal } from "../components/CategoriaModal";
import type { Categoria } from "../types/categoria";

import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  type CategoriaFormValues,
} from "../services/categorias";

function CategoriasPage() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [mensaje, setMensaje] = useState<{
      titulo: string;
      mensaje: string;
      tipo: "error" | "exito" | "advertencia";
  } | null>(null);

  const user = useAuthStore((state) => state.user);
  const isAdmin = (user?.role === "admin");

  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<Categoria | undefined>(undefined);

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "categorias",
      pagination.pageIndex,
      pagination.pageSize,
    ],
    queryFn: () =>
      obtenerCategorias({
        skip: pagination.pageIndex * pagination.pageSize,
        limit: pagination.pageSize,
      }),
  });

  const categorias = data?.categorias ?? [];
  const total = data?.total ?? 0;

  const crearCategoriaMutation = useMutation({
    mutationFn: crearCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setMensaje({
        titulo: "Operación exitosa",
        mensaje: "La categoría se creó correctamente.",
        tipo: "exito",
      });
      cerrarModal();
    },
    onError: (error) => {
      setMensaje({
        titulo: "No se pudo crear la categoría",
        mensaje: error.message,
        tipo: "error",
      });
    },
  });

  const actualizarCategoriaMutation = useMutation({
    mutationFn: actualizarCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setMensaje({
        titulo: "Operación exitosa",
        mensaje: "La categoría se actualizó correctamente.",
        tipo: "exito",
      });
      cerrarModal();
    },
    onError: (error) => {
      setMensaje({
        titulo: "No se pudo actualizar la categoría",
        mensaje: error.message,
        tipo: "error",
      });
    },
  });

  const eliminarCategoriaMutation = useMutation({
    mutationFn: eliminarCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setMensaje({
        titulo: "Operación exitosa",
        mensaje: "La categoría se eliminó correctamente.",
        tipo: "exito",
      });
    },
    onError: (error) => {
      setMensaje({
        titulo: "No se pudo eliminar la categoría",
        mensaje: error.message,
        tipo: "error",
      });
    },
  });

  const abrirNuevaCategoria = () => {
    setCategoriaSeleccionada(undefined);
    setModalAbierto(true);
  };

  const editarCategoria = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCategoriaSeleccionada(undefined);
  };

  const guardarCategoria = (valores: CategoriaFormValues) => {
    if (categoriaSeleccionada) {
      actualizarCategoriaMutation.mutate({
        id: categoriaSeleccionada.id,
        valores,
      });
    } else {
      crearCategoriaMutation.mutate(valores);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      eliminarCategoriaMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-gray-600">Cargando categorías...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-red-500">Error al cargar las categorías.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black">Categorías</h1>
        {isAdmin && (
          <button
            onClick={abrirNuevaCategoria}
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          >
            + Añadir categoría
          </button>
        )}
      </div>

    <CategoriaList
      categorias={categorias}
      total={total}
      pagination={pagination}
      onPaginationChange={setPagination}
      onEditar={editarCategoria}
      onEliminar={handleDelete}
        />

    {modalAbierto && (
      <FormCategoriaModal
          categoria={categoriaSeleccionada}
          onCerrar={cerrarModal}
          onSubmit={guardarCategoria}
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

export default CategoriasPage;