import axios from "axios";

export function extractApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = (error.response?.data as { detail?: unknown } | undefined)
      ?.detail;

    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((x) =>
          x && typeof x === "object" && "msg" in x
            ? String((x as { msg: unknown }).msg)
            : String(x),
        )
        .join("; ");
    }

    if (error.code === "ERR_NETWORK") return "No se pudo contactar al servidor";
    if (error.response) return `Error HTTP ${error.response.status}`;
    return error.message;
  }

  return error instanceof Error ? error.message : "Error inesperado";
}

export function handleApiError(error: unknown): void {
  if (!axios.isAxiosError(error)) {
    console.error("[api] Error no-HTTP:", error);
    return;
  }

  const status = error.response?.status;
  const message = extractApiErrorMessage(error);

  switch (status) {
    case 400:
    case 422:
      console.warn("[api] Datos inválidos:", message);
      break;
    case 401:
      console.warn("[api] No autorizado:", message);
      break;
    case 403:
      console.warn("[api] Permisos insuficientes:", message);
      break;
    case 404:
      console.warn("[api] Recurso no encontrado:", message);
      break;
    case 500:
      console.error("[api] Error interno del servidor:", message);
      break;
    default:
      console.error("[api] Error inesperado:", message);
  }
}
