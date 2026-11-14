export interface Producto {
  id: number;
  categoria_id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  imagen_url: string | null;
  stock: number;
  disponible: boolean;
  activo: boolean;
  categoria: ProductoCategoria;
}

export interface ProductoCategoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  es_principal: boolean;
}

export interface ProductoFormValues {
  nombre: string;
  descripcion: string;
  precio_base: number;
  stock: number;
  imagen_url: string | null;
  disponible: boolean;
  categoria: ProductoCategoria;
}