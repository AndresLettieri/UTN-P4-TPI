import { useState } from "react";
import MensajeModal from "../../../components/MensajeModal";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import UsuarioList from "../UsuarioList";

import {
  obtenerUsuarios,
  activarUsuario,
  desactivarUsuario,
} from "../services/usuarios";
import { useAuthStore } from "../../../store/authStore";

function AdminUserPage() {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const currentUser = useAuthStore((state) => state.user);
  
  const [mensaje, setMensaje] = useState<{
    titulo: string;
    mensaje: string;
    tipo: "error" | "exito" | "advertencia";
  } | null>(null);


  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "usuarios",
      pagination.pageIndex,
      pagination.pageSize,
    ],
    queryFn: () =>
      obtenerUsuarios({
        skip: pagination.pageIndex * pagination.pageSize,
        limit: pagination.pageSize,
      }),
  });

  const usuarios = data?.usuarios ?? [];
  const total = data?.total ?? 0;

  const activarUsuarioMutation = useMutation({
    mutationFn: async (id: number) => {
      return activarUsuario(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      setMensaje({
        titulo: "Operación exitosa",
        mensaje: "El usuario se activó correctamente.",
        tipo: "exito",
      });
    },
    onError: (error) => {
      setMensaje({
        titulo: "No se pudo activar el usuario",
        mensaje: error.message,
        tipo: "error",
      });
    },
  });

  const desactivarUsuarioMutation = useMutation({
    mutationFn: async (id: number) => {
      return desactivarUsuario(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      setMensaje({
        titulo: "Operación exitosa",
        mensaje: "El usuario se desactivó correctamente.",
        tipo: "exito",
      });
    },
    onError: (error) => {
      setMensaje({
        titulo: "No se pudo desactivar el usuario",
        mensaje: error.message,
        tipo: "error",
      });
    },
  });

  const handleActivarUsuario = (id: number) => {
    if(confirm("¿Estás seguro de que deseas activar este usuario?")) {
      activarUsuarioMutation.mutate(id);
    }
  }

  const handleDesactivarUsuario = (id: number) => {
    if(confirm("¿Estás seguro de que deseas desactivar este usuario?")) {
      desactivarUsuarioMutation.mutate(id);
    }
  }

  if (isLoading) {
      return (
      <main className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-gray-600">Cargando usuarios...</p>
      </main>
    );
  }

    if (isError) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-red-500">
          Error al cargar los usuarios.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          Administración de usuarios
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Consultá el estado de las cuentas y administrá su acceso.
        </p>
      </div>
      <UsuarioList
        usuarios={usuarios}
        total={total}
        pagination={pagination}
        onPaginationChange={setPagination}
        onActivar={handleActivarUsuario}
        onDesactivar={handleDesactivarUsuario}
        currentUserId={currentUser?.id}
        isProcessing={
          activarUsuarioMutation.isPending ||
          desactivarUsuarioMutation.isPending
        }
      />

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

export default AdminUserPage;
    