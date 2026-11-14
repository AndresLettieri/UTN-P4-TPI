import { api } from "../../../shared/api/axiosInstance";
import type { Usuario } from "../types/usuario";

export interface UsuariosResponse {
  usuarios : Usuario[];
  total: number;
}

export async function obtenerUsuarios({
  skip = 0,
  limit = 10
  }: {
    skip?: number;
    limit?: number;
} = {}): Promise<UsuariosResponse> {
  const response = await api.get<UsuariosResponse>(
    "/usuarios/admin/usuarios",
    {
      params: { skip, limit },
    }
  );
  return response.data;
}

export async function activarUsuario(id: number): Promise<void> {
  await api.post(`/api/usuarios/${id}/activar`);
}

export async function desactivarUsuario(id: number): Promise<void> {
  await api.post(`/api/usuarios/${id}/desactivar`);
}
