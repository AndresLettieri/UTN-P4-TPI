import { api } from "../../../shared/api/axiosInstance";
import type { Categoria } from "../types/categoria";

export type CategoriaFormValues = Omit<Categoria, "id">;

export interface CategoriaListResponse {
    categorias: Categoria[];
    total: number;
}


export async function obtenerCategorias({
    skip = 0,
    limit = 5,
}: {
    skip?: number;
    limit?: number;
} = {}): Promise<CategoriaListResponse> {
    const { data } = await api.get<CategoriaListResponse>(`/categorias`, {
        params: {
            skip,
            limit,
        },
    });
    return data;
}

export async function crearCategoria(
    valores: CategoriaFormValues
): Promise<Categoria> {
    const { data } = await api.post<Categoria>(`/categorias`, valores);
    return data;
}

export async function actualizarCategoria({
    id,
    valores,
}: {
    id: number;
    valores: CategoriaFormValues;
}): Promise<Categoria> {
    const { data } = await api.put<Categoria>(`/categorias/${id}`, valores);
    return data;
}

export async function eliminarCategoria(id: number): Promise<void> {
    await api.delete(`/categorias/${id}`);
}

