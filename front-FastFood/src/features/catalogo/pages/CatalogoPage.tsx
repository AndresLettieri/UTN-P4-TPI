import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { obtenerProductos } from "../../productos/services/productos";
import { obtenerCategorias } from "../../categorias/services/categorias";
import CatalogoFiltros from "../components/CatalogoFiltros";
import ProductoCard from "../components/ProductoCard";

const PAGE_SIZE = 8;

function CatalogoPage() {
  const [page, setPage] = useState(0);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCategory, setAppliedCategory] = useState<number | undefined>();

  const {
    data: categoriasData,
    isLoading: isLoadingCategorias,
  } = useQuery({
    queryKey: ["catalogo", "categorias"],
    queryFn: () => obtenerCategorias({ skip: 0, limit: 100 }),
  });

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "catalogo",
      "productos",
      page,
      appliedSearch,
      appliedCategory,
    ],
    queryFn: () =>
      obtenerProductos({
        skip: page * PAGE_SIZE,
        limit: PAGE_SIZE,
        search: appliedSearch || undefined,
        categoria_id: appliedCategory,
      }),
  });

  const productos = data?.productos ?? [];
  const categorias = categoriasData?.categorias ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleBuscar = () => {
    setAppliedSearch(search.trim());
    setAppliedCategory(
      selectedCategory ? Number(selectedCategory) : undefined
    );
    setPage(0);
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-gray-600">Cargando catálogo...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-red-500">
          No se pudo cargar el catálogo.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          Reintentar
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Productos
          </h2>
        </div>

        <CatalogoFiltros
          search={search}
          setSearch={setSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          handleBuscar={handleBuscar}
          categorias={categorias}
          isLoadingCategorias={isLoadingCategorias}
        />
        

        {productos.length === 0 ? (
          <p className="text-gray-500">
            {appliedSearch || appliedCategory
              ? "No se encontraron productos con los filtros seleccionados."
              : "No hay productos en el catálogo."}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productos.map((producto) => (
                <ProductoCard
                  key={producto.id}
                  producto={producto}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={page === 0}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Anterior
                </button>

                <span className="text-sm text-gray-600">
                  Página {page + 1} de {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default CatalogoPage;
