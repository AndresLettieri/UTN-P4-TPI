import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelarPedido } from "../api/pedidos";

export const useCancelarPedido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pedidoId: number) => cancelarPedido(pedidoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
};