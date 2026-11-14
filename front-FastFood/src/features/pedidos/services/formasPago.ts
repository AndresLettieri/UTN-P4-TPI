import { api } from "../../../shared/api/axiosInstance";
import type { FormaPago } from "../types/formasPago";

export async function obtenerFormasPago(): Promise<FormaPago[]> {
  const { data } = await api.get<FormaPago[]>("/catalogo/formas-pago");

  return data.filter((formaPago) => formaPago.activo);
}