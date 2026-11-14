import { useNavigate } from "react-router-dom";



export default function UnauthorizedPage() {
  const navigate = useNavigate();
  return (
    <main className="mx-auto mt-16 max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-zinc-900">
        Acceso denegado
      </h1>

      <p className="mt-3 text-sm text-zinc-600">
        No tenés permisos suficientes para acceder a esta página.
      </p>

      <button
        type="button"
        onClick={() => navigate("/login", { replace: true })}
        className="mt-6 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
      >
        Volver
      </button>
    </main>
  );
}
