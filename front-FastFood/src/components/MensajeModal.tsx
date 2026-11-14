
type MensajeModalProps = {
    titulo: string;
    mensaje: string;
    tipo?: "error" | "exito" | "advertencia";
    onCerrar: () => void;
};

export default function MensajeModal({
    titulo,
    mensaje,
    tipo = "error",
    onCerrar,
}: MensajeModalProps) {
    const colorTitulo = {
        error: "text-red-600",
        exito: "text-green-600",
        advertencia: "text-yellow-600",
    };

    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/40">
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="mensaje-modal-titulo"
                className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            >
                <h2
                    id="mensaje-modal-titulo"
                    className={`mb-3 text-xl font-semibold ${colorTitulo[tipo]}`}
                >
                    {titulo}
                </h2>

                <p className="mb-6 text-gray-700">{mensaje}</p>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onCerrar}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
}
