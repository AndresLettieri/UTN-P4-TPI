import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  producto_id: number;
  cantidad: number;
}

interface CartState {
  // Carritos separados por usuario. La clave "null" corresponde al visitante.
  carritos: Record<string, CartItem[]>;

  // Carrito que se está utilizando actualmente.
  usuarioId: number | null;
  items: CartItem[];

  cambiarUsuario: (usuarioId: number | null) => void;
  agregarProducto: (productoId: number, cantidad: number) => void;
  quitarProducto: (productoId: number) => void;
  modificarCantidad: (productoId: number, cantidad: number) => void;
  vaciarCarrito: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      carritos: {
        null: [],
      },
      usuarioId: null,
      items: [],



      cambiarUsuario: (usuarioId) =>
        set((state) => {
          const claveUsuario = String(usuarioId);
          if (usuarioId !== null && state.carritos[claveUsuario]) {
            return {
              usuarioId,
              items: state.carritos[claveUsuario],
            };
          }
          // Si no existe uno propio, se reutiliza el carrito anónimo.
          const items = state.carritos[claveUsuario] ?? state.carritos["null"] ?? [];

          return {
            usuarioId,
            items,
            carritos: {
              ...state.carritos,
              [claveUsuario]: items,
              ...(usuarioId !== null ? { null: [] } : {}),
            },
          };
        }),



      agregarProducto: (productoId, cantidad) =>
        set((state) => {
          if (cantidad <= 0) return state;

          const existente = state.items.find(
            (item) => item.producto_id === productoId
          );

          const nuevosItems = existente
            ? state.items.map((item) =>
                item.producto_id === productoId
                  ? { ...item, cantidad: item.cantidad + cantidad }
                  : item
              )
            : [...state.items, { producto_id: productoId, cantidad }];

          return {
            items: nuevosItems,
            carritos: {
              ...state.carritos,
              [String(state.usuarioId)]: nuevosItems,
            },
          };
        }),

      quitarProducto: (productoId) =>
        set((state) => {
          const nuevosItems = state.items.filter(
            (item) => item.producto_id !== productoId
          );

          return {
            items: nuevosItems,
            carritos: {
              ...state.carritos,
              [String(state.usuarioId)]: nuevosItems,
            },
          };
        }),

      modificarCantidad: (productoId, cantidad) =>
        set((state) => {
          const nuevosItems =
            cantidad <= 0
              ? state.items.filter(
                  (item) => item.producto_id !== productoId
                )
              : state.items.map((item) =>
                  item.producto_id === productoId
                    ? { ...item, cantidad }
                    : item
                );

          return {
            items: nuevosItems,
            carritos: {
              ...state.carritos,
              [String(state.usuarioId)]: nuevosItems,
            },
          };
        }),

        vaciarCarrito: () =>
          set((state) => {
            const carritos = { ...state.carritos };

            delete carritos[String(state.usuarioId)];

            return {
              carritos,
              items: [],
            };
          }),
    }),
    {
      name: "food-store-cart",
      version: 1,

      // Conservamos el carrito anterior como carrito de visitante.
      migrate: (persistedState) => {
        const anterior = persistedState as { items?: CartItem[] };
        const items = anterior.items ?? [];

        return {
          carritos: {
            null: items,
          },
          usuarioId: null,
          items,
        };
      },
    }
  )
);
