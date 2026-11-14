import type { Categoria } from "../types/categoria";

interface CategoriaCardProps {
    categoria: Categoria;
    onEditar: (categoria: Categoria) => void;
    onEliminar: (id: number) => void;
}

function CategoriaCard({
    categoria,
    onEditar,
    onEliminar,
}: CategoriaCardProps) {
    const eliminar = () => {
        const confirmado = window.confirm(`¿Está seguro de eliminar la categoría "${categoria.nombre}"?`);

        if (confirmado) {
        onEliminar(categoria.id);
        }
    };

    return (
        <div className="grid grid-cols-[80px_1fr_2fr_160px] items-center border-b border-gray-200 px-6 py-4">
        <span className="text-gray-700">{categoria.id}</span>
        <span className="font-medium text-black">{categoria.nombre}</span>
        <span className="text-gray-700">{categoria.descripcion}</span>
        <div className="flex gap-4">
            <button onClick={() => onEditar(categoria)} className="font-medium text-blue-500 hover:text-blue-700">
            Editar
            </button>

            <button onClick={eliminar} className="font-medium text-red-500 hover:text-red-700">
            Eliminar
            </button>
        </div>
        </div>
    );
}

export default CategoriaCard;