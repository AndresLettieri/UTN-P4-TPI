export interface ItemPedidoCreate {
  producto_id: number;
  cantidad: number;
}

export interface PedidoCreate {
  forma_pago: string;
  direccion_entrega: string;
  notas?: string | null;
  items: ItemPedidoCreate[];
}

export interface DetallePedido {
  producto_id: number;
  nombre_producto: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  usuario_id: number;
  estado: string;
  forma_pago: string;
  direccion_entrega: string;
  notas: string | null;
  total: number;
  created_at: string;
  updated_at: string;
  items: DetallePedido[];
}

export interface PedidosPaginados {
  items: Pedido[];
  total: number;
}