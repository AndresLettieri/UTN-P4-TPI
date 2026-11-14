
import { useForm } from "@tanstack/react-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const setError = useAuthStore((state) => state.setError);
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setError(null);

      try {
        await login(value.username, value.password);

        const user = useAuthStore.getState().user;

        const from = location.state?.from?.pathname;
        const esAdmin = user?.role === "admin";

        const esRutaAdministrativa =
          from === "/admin" || from?.startsWith("/admin/");

        if (from && (esAdmin || !esRutaAdministrativa)) {
          navigate(from, { replace: true });
        } else if (esAdmin) {
          navigate("/admin/resumen", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch {
        // El error queda guardado en Zustand.
      }
    },
  });

  return (
    <main className="mx-auto mt-12 w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="text-center text-xl font-semibold text-zinc-900">
        Iniciar sesión
      </h1>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {error}
        </p>
      )}

      <form
        className="mt-5 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field name="username">
          {(field) => (
            <label className="block text-sm font-medium text-zinc-700">
              Usuario
              <input
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand-500"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  field.handleChange(event.target.value);
                  if (error) setError(null);
                }}
                autoComplete="username"
                required
              />
            </label>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <label className="block text-sm font-medium text-zinc-700">
              Contraseña
              <input
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand-500"
                type="password"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  field.handleChange(event.target.value);
                  if (error) setError(null);
                }}
                autoComplete="current-password"
                required
              />
            </label>
          )}
        </form.Field>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isLoading ? "Ingresando…" : "Entrar"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-600">
        ¿No tenés cuenta?{" "}
        <Link
          to="/register"
          className="font-medium text-brand-700 hover:underline"
        >
          Registrate
        </Link>
      </p>
    </main>
  );
}
