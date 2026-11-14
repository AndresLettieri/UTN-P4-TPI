import { api } from "../../../shared/api/axiosInstance";
import type { Usuario, UsuarioCreatePayload } from "../../usuarios/types/usuario";

const AUTH = "/auth";

export async function requestLogin(
  username: string,
  password: string,
): Promise<void> {
  const body = new URLSearchParams({ username, password });
  await api.post(`${AUTH}/token`, body);
}

export async function requestRegister(
  payload: UsuarioCreatePayload,
): Promise<Usuario> {
  const { data } = await api.post<Usuario>(`${AUTH}/register`, payload);
  return data;
}

export async function requestMe(): Promise<Usuario> {
  const { data } = await api.get<Usuario>(`${AUTH}/me`);
  return data;
}

/** Le pide al backend que invalide la cookie httpOnly. */
export async function requestLogout(): Promise<void> {
  await api.post(`${AUTH}/logout`);
}
