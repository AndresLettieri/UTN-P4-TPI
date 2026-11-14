
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

export default function RegisterPage() {
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const setError = useAuthStore((state) => state.setError);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      username: "",
      full_name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setError(null);

      try {
        await register({
          username: value.username,
          full_name: value.full_name,
          email: value.email,
          password: value.password,
        });

        navigate("/categories", {
          replace: true,
          state: { message: "Cuenta creada. Ya podés iniciar sesión." },
        });
      } catch {
        // El error se muestra desde Zustand.
      }
    },
  });

  const inputClass =
    "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-brand-500";

  return (
    <main className="mx-auto mt-12 w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="text-center text-xl font-semibold text-zinc-900">
        Crear cuenta
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
        className="mt-5 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field name="username">
          {(field) => (
            <label className="block text-sm font-medium text-zinc-700">
              Nombre de usuario
              <input
                className={inputClass}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                autoComplete="username"
                required
              />
            </label>
          )}
        </form.Field>

        <form.Field name="full_name">
          {(field) => (
            <label className="block text-sm font-medium text-zinc-700">
              Nombre completo
              <input
                className={inputClass}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                autoComplete="name"
                required
              />
            </label>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <label className="block text-sm font-medium text-zinc-700">
              Email
              <input
                className={inputClass}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                autoComplete="email"
                required
              />
            </label>
          )}
        </form.Field>
        
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              value.length < 8
                ? "La contraseña debe tener al menos 8 caracteres."
                : undefined,
          }}
        >
          {(field) => (
            <label className="block text-sm font-medium text-zinc-700">
              Contraseña (mín. 8 caracteres)
              <input
                className={inputClass}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <span className="mt-1 block text-xs text-red-600">
                    {field.state.meta.errors.join(", ")}
                  </span>
                )}
            </label>
          )}
        </form.Field>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isLoading ? "Registrando…" : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-600">
        ¿Ya tenés cuenta?{" "}
        <Link
          to="/login"
          className="font-medium text-brand-700 hover:underline"
        >
          Iniciá sesión
        </Link>
      </p>
    </main>
  );
}
