
import { Link, NavLink } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useNavigate } from "react-router-dom";


function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate("/login", { replace: true });
    await logout();
  };

  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.cantidad, 0)
  );

  const isAdmin = user?.role === "admin";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-brand-50 text-brand-700"
        : "text-zinc-600 hover:bg-zinc-100 hover:text-brand-700"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-6">

        <Link
          to="/"
          className="shrink-0 text-xl font-bold tracking-tight text-brand-600 hover:text-brand-700"
        >
          FastFood
        </Link>

        <nav className="flex flex-wrap items-center gap-2 ">
    
          {isAdmin && (
            <>
              <NavLink to="/admin/resumen" className={linkClass}>
                Dashboard
              </NavLink>

              <NavLink to="/admin/categorias" className={linkClass}>
                Categorías
              </NavLink>

              <NavLink to="/admin/productos" className={linkClass}>
                Productos
              </NavLink>

              <NavLink to="/admin/usuarios" className={linkClass}>
                Usuarios
              </NavLink>
              <NavLink to="/mis-pedidos" className={linkClass}>
                Pedidos
              </NavLink>

            </>
          )}

          <NavLink to="/" end className={linkClass}>
            Catálogo
          </NavLink>

          {user && !isAdmin && (
            <NavLink to="/mis-pedidos" className={linkClass}>
              Mis pedidos
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">

          <Link
            to="/carrito"
            className="relative inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            <span>Carrito</span>

            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">
              {cartCount}
            </span>
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
              >
                Iniciar sesión
              </Link>

            </>
          ) : (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-zinc-900">
                  {user.full_name}
                </p>
                <p className="text-xs text-zinc-500">
                  {isAdmin ? "Administrador" : "Usuario"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
