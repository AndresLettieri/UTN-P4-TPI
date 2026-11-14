import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearPedido } from "../api/pedidos";
import type { PedidoCreate } from "../types/pedido";

export const useCrearPedido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pedido: PedidoCreate) => crearPedido(pedido),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
};