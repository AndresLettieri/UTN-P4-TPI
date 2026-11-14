import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getApiBase } from "../../lib/config";
import {
  extractApiErrorMessage,
  handleApiError,
} from "../../shared/api/handle-api-error";

export const api = axios.create({
  baseURL: getApiBase(),
  withCredentials: true,
  timeout: 15_000,
  headers: { Accept: "application/json" },
});


let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.set("Accept", "application/json");
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

let onAccountDeactivated: (() => void) | null = null;

export function setAccountDeactivatedHandler(
  handler: () => void,
): void {
  onAccountDeactivated = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    handleApiError(error);

    const data = error.response?.data as
      | { detail?: string }
      | undefined;

    const isAccountDeactivated =
      error.response?.status === 400 &&
      data?.detail === "Cuenta de usuario desactivada";

    if (isAccountDeactivated) {
      onAccountDeactivated?.();
    } else if (error.response?.status === 401) {
      onUnauthorized?.();
    }

    const normalized = new Error(extractApiErrorMessage(error));
    normalized.cause = error;
    return Promise.reject(normalized);
  },
);
