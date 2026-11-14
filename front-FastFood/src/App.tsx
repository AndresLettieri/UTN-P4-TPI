import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/routes/ProtectedRoute";

import CatalogoPage from "./features/catalogo/pages/CatalogoPage";
import CarritoPage from "./features/carrito/pages/CarritoPage";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import UnauthorizedPage from "./features/auth/UnauthorizedPage";

import CategoriasPage from "./features/categorias/pages/CategoriasPage";
import AdminProductosPage from "./features/productos/pages/AdminProductosPage";
import AdminUserPage from "./features/usuarios/pages/AdminUserPage";
import AdminResumenPage from "./features/pedidos/pages/AdminResumenPage";
import CheckoutPage from "./features/pedidos/pages/CheckoutPage";
import MisPedidosPage from "./features/pedidos/pages/MisPedidosPage";

import { useAuthStore } from "./store/authStore";

function App() {
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  const homeRoute = user?.role === "admin" ? "/admin/resumen" : "/";
  const mostrarNavbar = !["/login", "/register"].includes(location.pathname);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100">
        <p className="text-sm text-zinc-500">
          Restaurando sesión...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      {mostrarNavbar && <Navbar />}

      <Routes>
        {/* Publicas */}
        <Route path="/" element={<CatalogoPage />} />
        <Route path="/carrito" element={<CarritoPage />} />

        {/* Acceso */}
        <Route path="/login" element={
            user ? <Navigate to={homeRoute} replace /> : <LoginPage />
          }
        />
        <Route path="/register" element={
            user ? <Navigate to={homeRoute} replace /> : <RegisterPage />
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Rutas protegidas para usuarios autenticados */}
        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/mis-pedidos" element={<MisPedidosPage />} />
        </Route>

        {/* Solo admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/resumen" element={<AdminResumenPage />} />
          <Route path="/admin/categorias" element={<CategoriasPage />} />
          <Route path="/admin/productos" element={<AdminProductosPage />} />
          <Route path="/admin/usuarios" element={<AdminUserPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={homeRoute} replace />} />
      </Routes>
    </div>
  );
}

export default App;
