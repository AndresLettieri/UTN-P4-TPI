import { useForm } from '@tanstack/react-form'
import type { Categoria } from "../types/categoria";

type CategoriaFormValues = Omit<Categoria, "id">;

const input = "w-full rounded-md border border-gray-300 px-3 py-2 text-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"

type Props = {
  categoria?: Categoria;
  onSubmit?: (v: CategoriaFormValues) => void;
  onCerrar: () => void;
};


export const FormCategoriaModal = ({
  categoria,
  onSubmit,
  onCerrar,
}: Props) => {
    const form = useForm({
        defaultValues: { 
            nombre: categoria?.nombre ?? '', 
            descripcion: categoria?.descripcion ?? '' } as CategoriaFormValues,
        validators: {
        onSubmit: ({ value }) => {
                if (!value.nombre.trim()) {
                    return { fields: { nombre: 'El nombre es obligatorio' } }
                }
                return undefined
            },
        },
        onSubmit: async ({ value }) => {
            onSubmit?.(value)
        },
    })

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                <h2 className="mb-6 text-xl font-semibold text-black">
                    {categoria ? "Editar categoría" : "Nueva categoría"}
                </h2>

                <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }} className="flex flex-col gap-4">
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-black">Nombre</label>
                        <form.Field name="nombre">
                            {(f) => (
                                <>
                                    <input
                                    placeholder="Nombre"
                                    className={input}
                                    value={f.state.value}
                                    onChange={(e) => f.handleChange(e.target.value)}/>
                                    {f.state.meta.errors.map((err) => (
                                        <p key={String(err)} className="mt-1 text-xs text-red-500">{err}</p>
                                    ))}
                                
                                </>
                            )}
                        </form.Field>
                    </div>

                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-black">Descripción</label>
                        <form.Field name="descripcion">
                            {(f) => (
                                <>
                                    <textarea
                                        placeholder="Descripción"
                                        className={`${input} resize-none`}
                                        value={f.state.value}
                                        onChange={(e) => f.handleChange(e.target.value)}
                                        rows={4}
                                    />
                                    {f.state.meta.errors.map((err) => (
                                        <p key={String(err)} className="mt-1 text-xs text-red-500">{err}</p>
                                    ))}
                                </>
                            )}
                        </form.Field>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onCerrar}
                            className="rounded-md border border-gray-300 px-4 py-2 font-medium text-black hover:bg-gray-100"
                        >
                            Cancelar
                        </button>

                        <button type="submit" className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

