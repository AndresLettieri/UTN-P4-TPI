import React from "react";

interface CatalogoFiltrosProps {
  search: string;
  setSearch: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  handleBuscar: () => void;
  categorias: { id: number; nombre: string }[];
  isLoadingCategorias: boolean;
}

const CatalogoFiltros: React.FC<CatalogoFiltrosProps> = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  handleBuscar,
  categorias,
  isLoadingCategorias,
}) => {
  return (

<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
  <input
    type="search"
    value={search}
    onChange={(event) => setSearch(event.target.value)}
    onKeyDown={(event) => {
      if (event.key === "Enter") {
        handleBuscar();
      }
    }}
    placeholder="Buscar productos..."
    className="min-w-0 flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
  />

  <select
    value={selectedCategory}
    onChange={(event) => setSelectedCategory(event.target.value)}
    disabled={isLoadingCategorias}
    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
  >
    <option value="">Todas las categorías</option>

    {categorias.map((categoria) => (
      <option key={categoria.id} value={categoria.id}>
        {categoria.nombre}
      </option>
    ))}
  </select>

  <button
    type="button"
    onClick={handleBuscar}
    className="rounded-md bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700"
  >
    Buscar
  </button>
  </div>
  );
};

export default CatalogoFiltros;