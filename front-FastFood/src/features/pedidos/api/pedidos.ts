import { api } from "../../../shared/api/axiosInstance";
import type { ResumenPedido } from "../types/resumenPedido";
import type { Pedido, PedidoCreate, PedidosPaginados } from "../types/pedido";

export const obtenerResumenPedidos = async (): Promise<ResumenPedido> => {
  const { data } = await api.get<ResumenPedido>("/pedidos/resumen");
  return data;
};

export const crearPedido = async (pedido: PedidoCreate): Promise<Pedido> => {
  const { data } = await api.post<Pedido>("/pedidos/", pedido);
  return data;
};

export const obtenerPedidos = async (
  skip: number = 0,
  limit: number = 10
): Promise<PedidosPaginados> => {
  const { data } = await api.get<PedidosPaginados>("/pedidos/", {
    params: { skip, limit },
  });

  return data;
};

export const cancelarPedido = async (pedidoId: number): Promise<Pedido> => {
  const { data } = await api.post<Pedido>(
    `/pedidos/${pedidoId}/cancelar`
  );
  return data;
};

export const cambiarEstadoPedido = async (
  pedidoId: number
): Promise<Pedido> => {
  const { data } = await api.post<Pedido>(
    `/pedidos/${pedidoId}/estado`
  );
  return data;
};