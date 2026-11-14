import { useForm } from "@tanstack/react-form";
import type { Categoria } from "../../categorias/types/categoria";
import { useEffect } from "react";

import type {
    Producto,
    ProductoFormValues,
    ProductoCategoria,
} from "../types/producto";

interface ProductoModalProps {
    abierto: boolean;
    producto?: Producto;
    categorias: Categoria[];
    onCerrar: () => void;
    onSubmit: (producto: ProductoFormValues) => void;
}

const input =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

function FormProductoModal({
    abierto,
    producto,
    categorias,
    onCerrar,
    onSubmit,
}: ProductoModalProps) {
    const form = useForm({
        defaultValues: {
            nombre: producto?.nombre ?? "",
            descripcion: producto?.descripcion ?? "",
            precio_base: producto?.precio_base ?? 0,
            stock: producto?.stock ?? 0,
            imagen_url: producto?.imagen_url ?? "",
            disponible: producto?.disponible ?? true,
            categoria: producto?.categoria ?? ({} as ProductoCategoria),
        } as ProductoFormValues,

        validators: {
            onSubmit: ({ value }) => {
                const errors: Record<string, string> = {};

                if (!value.nombre.trim()) {
                    errors.nombre = "El nombre es obligatorio";
                }

                if (!value.descripcion?.trim()) {
                    errors.descripcion = "La descripción es obligatoria";
                }

                if (value.precio_base < 0) {
                    errors.precio_base = "El precio no puede ser negativo";
                }

                if (!value.categoria?.id) {
                    errors.categoria = "Debés seleccionar una categoría";
                }

                return Object.keys(errors).length
                    ? { fields: errors }
                    : undefined;
            },
        },

        onSubmit: async ({ value }) => {
            onSubmit(value);
        },
    });

    useEffect(() => {
        if (abierto) {
            form.reset({
                nombre: producto?.nombre ?? "",
                descripcion: producto?.descripcion ?? "",
                precio_base: producto?.precio_base ?? 0,
                stock: producto?.stock ?? 0,
                imagen_url: producto?.imagen_url ?? "",
                disponible: producto?.disponible ?? true,
                categoria: producto?.categoria ?? ({} as ProductoCategoria),
            });
        }
    }, [abierto, producto]);

    if (!abierto) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4 py-6">
            <div className="w-full max-w-lg overflow-y-auto rounded-lg bg-white p-4 shadow-xl">
                <h2 className="mb-3 text-xl font-semibold text-black">
                    {producto ? "Editar producto" : "Nuevo producto"}
                </h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="flex flex-col gap-2"
                >
                    <form.Field name="nombre">
                        {(field) => (
                            <div>
                                <label className="mb-1 block text-sm font-medium text-black">
                                    Nombre
                                </label>
                                <input
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className={input}
                                />
                                {field.state.meta.errors.map((error, i) => (
                                    <p key={i} className="mt-1 text-xs text-red-500">
                                        {String(error)}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="descripcion">
                        {(field) => (
                            <div>
                                <label className="mb-1 block text-sm font-medium text-black">
                                    Descripción
                                </label>
                                <textarea
                                    rows={2}
                                    value={field.state.value ?? ""}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className={`${input} resize-none`}
                                />
                                {field.state.meta.errors.map((error, i) => (
                                    <p key={i} className="mt-1 text-xs text-red-500">
                                        {String(error)}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="precio_base">
                        {(field) => (
                            <div>
                                <label className="mb-1 block text-sm font-medium text-black">
                                    Precio base
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(Number(e.target.value))}
                                    className={input}
                                />
                                {field.state.meta.errors.map((error, i) => (
                                    <p key={i} className="mt-1 text-xs text-red-500">
                                        {String(error)}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="stock">
                        {(field) => (
                            <div>
                                <label className="mb-1 block text-sm font-medium text-black">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(Number(e.target.value))}
                                    className={input}
                                />
                                {field.state.meta.errors.map((error, i) => (
                                    <p key={i} className="mt-1 text-xs text-red-500">
                                        {String(error)}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="imagen_url">
                        {(field) => (
                            <div>
                                <label className="mb-1 block text-sm font-medium text-black">
                                    Imagen URL
                                </label>
                                <input
                                    type="url"
                                    value={field.state.value ?? ""}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className={input}
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="categoria">
                        {(field) => (
                            <div>
                                <label className="mb-1 block text-sm font-medium text-black">
                                    Categoría
                                </label>
                                <select
                                    value={field.state.value?.id ?? ""}
                                    onChange={(e) => {
                                        const categoria = categorias.find(
                                            (c) => c.id === Number(e.target.value)
                                        );

                                        if (categoria) {
                                            field.handleChange({
                                                id: categoria.id,
                                                nombre: categoria.nombre,
                                                descripcion: categoria.descripcion,
                                                es_principal: true,
                                            });
                                        }
                                    }}
                                    className={`${input} bg-white`}
                                >
                                    <option value="" disabled>
                                        Seleccionar categoría
                                    </option>

                                    {categorias.map((categoria) => (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.nombre}
                                        </option>
                                    ))}
                                </select>

                                {field.state.meta.errors.map((error, i) => (
                                    <p key={i} className="mt-1 text-xs text-red-500">
                                        {String(error)}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onCerrar}
                            className="rounded-md border border-gray-300 px-4 py-2 font-medium text-black hover:bg-gray-100"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormProductoModal;
