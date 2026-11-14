import { useQuery } from "@tanstack/react-query";
import { obtenerPedidos } from "../api/pedidos";

export const usePedidos = (skip: number = 0, limit: number = 10) => {
  return useQuery({
    queryKey: ["pedidos", skip, limit],
    queryFn: () => obtenerPedidos(skip, limit),
  });
};