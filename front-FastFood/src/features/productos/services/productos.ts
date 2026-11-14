import { api } from "../../../shared/api/axiosInstance";

import type {
  Producto,
  ProductoFormValues,
} from "../types/producto";

export interface ProductoListResponse {
    productos: Producto[];
    total: number;
}

export async function obtenerProductoPorId(id: number): Promise<Producto> {
  const { data } = await api.get<Producto>(`/productos/${id}`);
  return data;
}

export async function obtenerProductos({
  skip = 0,
  limit = 10,
  search,
  categoria_id,
}: {
  skip?: number;
  limit?: number;
  search?: string;
  categoria_id?: number;
} = {}): Promise<ProductoListResponse> {
  const { data } = await api.get<ProductoListResponse>("/productos", {
    params: { skip, limit, search, categoria_id },
  });

  return data;
}

export async function crearProducto(producto: ProductoFormValues) {
    const { data } = await api.post<Producto>(`/productos`, {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio_base: producto.precio_base,
        stock: producto.stock,
        imagen_url: producto.imagen_url,
        disponible: producto.disponible,
        categoria_id: producto.categoria.id,
        categoria: producto.categoria
    });
    return data;
}

export async function actualizarProducto({
    id,
    producto,
}: {
    id: number;
    producto: ProductoFormValues;
}) {
    const { data } = await api.put<Producto>(`/productos/${id}`, {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio_base: producto.precio_base,
        stock: producto.stock,
        imagen_url: producto.imagen_url,
        disponible: producto.disponible,
        categoria_id: producto.categoria.id,
        categoria: producto.categoria
    });
    return data;
}

export async function desactivarProducto(id: number): Promise<void> {
    await api.delete(`/productos/${id}`);
}




export async function agregarCategoria({
    productoId,
    categoriaId,
}: {
    productoId: number;
    categoriaId: number;
}) {
    const { data } = await api.post(`/productos/${productoId}/categorias/`, {
        categoria_id: categoriaId,
    });
    return data;
}

export async function eliminarCategoria({
    productoId,
    categoriaId,
}: {
    productoId: number;
    categoriaId: number;
}) {
    await api.delete(`/productos/${productoId}/categorias/${categoriaId}`);
}

export async function marcarCategoriaPrincipal({
    productoId,
    categoriaId,
}: {
    productoId: number;
    categoriaId: number;
}) {
    await api.post(`/productos/${productoId}/categorias/${categoriaId}/principal`);
}


