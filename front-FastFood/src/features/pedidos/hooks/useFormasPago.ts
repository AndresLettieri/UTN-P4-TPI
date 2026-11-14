import { useQuery } from "@tanstack/react-query";
import { obtenerFormasPago } from "../services/formasPago";

export const useFormasPago = () => {
  return useQuery({
    queryKey: ["pedidos", "formas-pago"],
    queryFn: obtenerFormasPago,
  });
};