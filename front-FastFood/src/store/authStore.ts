import { create } from "zustand";
import { setUnauthorizedHandler } from "../shared/api/axiosInstance";
import * as authService from "../features/auth/services/auth";
import type { Usuario, UsuarioCreatePayload } from "../features/usuarios/types/usuario";
import { persist, createJSONStorage } from "zustand/middleware";
import { useCartStore } from "../store/cartStore";

interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<void>;
  register: (payload: UsuarioCreatePayload) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearSession: () => void;
  setError: (msg: string | null) => void;
}

let checkAuthPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>()(persist((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setError: (msg) => set({ error: msg }),

  clearSession: () => {
    useCartStore.getState().cambiarUsuario(null);

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },


  checkSession: () => {
    if (checkAuthPromise) {
      return checkAuthPromise;
    }

    set({ isLoading: true, error: null });

    checkAuthPromise = (async () => {
      try {
        const user = await authService.requestMe();
        useCartStore.getState().cambiarUsuario(user.id);

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        useCartStore.getState().cambiarUsuario(null);

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } finally {
        checkAuthPromise = null;
      }
    })();

    return checkAuthPromise;
  },


  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      await authService.requestLogin(username, password);

      const user = await authService.requestMe();
      useCartStore.getState().cambiarUsuario(user.id);
      set({ user, isAuthenticated: true, isLoading: false });
    
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error de inicio de sesión";
      set({ user: null, isAuthenticated: false, isLoading: false, error: msg });
      throw e;
    }
  },

register: async (payload) => {
  set({ isLoading: true, error: null });
  try {
    await authService.requestRegister(payload);
    await authService.requestLogin(payload.username, payload.password);
    const user = await authService.requestMe();

    useCartStore.getState().cambiarUsuario(user.id);

    set({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al registrarse";
    set({
      isLoading: false,
      error: msg,
    });
    throw e;
  }
},

  logout: async () => {
    try {
      await authService.requestLogout();
    } catch {
      // Aun si falla la red, limpiamos el estado local: el usuario
      // dejará de ver contenido protegido y un eventual 401 posterior
      // terminará de sincronizar la cookie.
    }
    useCartStore.getState().cambiarUsuario(null);
    set({ user: null, isAuthenticated: false, error: null, isLoading: false });
  },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);


setUnauthorizedHandler(() => useAuthStore.getState().clearSession());
