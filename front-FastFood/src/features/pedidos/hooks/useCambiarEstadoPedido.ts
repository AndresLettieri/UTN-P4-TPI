import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cambiarEstadoPedido } from "../api/pedidos";

export const useCambiarEstadoPedido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pedidoId: number) => cambiarEstadoPedido(pedidoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
};