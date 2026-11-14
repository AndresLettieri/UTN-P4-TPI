import { useMemo, useState } from "react";
import type { Categoria } from "../types/categoria";
import { useAuthStore } from "../../../store/authStore";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type PaginationState,
  type Updater,
} from "@tanstack/react-table";

interface CategoriaListProps {
  categorias: Categoria[];
  total: number;
  pagination: PaginationState;
  onPaginationChange: (updater: Updater<PaginationState>) => void;
  onEditar: (categoria: Categoria) => void;
  onEliminar: (id: number) => void;
}

const sortLabel: Record<string, string> = {
  asc: " ↑",
  desc: " ↓",
};

const cellBase = "border-b border-gray-200 px-6 py-3 text-left";

function CategoriaList({
  categorias,
  total,
  pagination,
  onPaginationChange,
  onEditar,
  onEliminar,
}: CategoriaListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtro, setFiltro] = useState("");
  const user = useAuthStore((state) => state.user);
  const isAdmin = (user?.role === "admin");
   
  const categoriasFiltradas = useMemo(() => {
      const busqueda = filtro.trim().toLowerCase();

      if (!busqueda) return categorias;

      return categorias.filter((categoria) => {
          const nombre = categoria.nombre?.toLowerCase() ?? "";
          const descripcion = categoria.descripcion?.toLowerCase() ?? "";

          return (
              nombre.includes(busqueda) ||
              descripcion.includes(busqueda)
          );
      });
  }, [categorias, filtro]);


  const columns = useMemo<ColumnDef<Categoria>[]>(() => {
    const cols: ColumnDef<Categoria>[] = [
      {
        accessorKey: "id",
        header: "ID",
        enableSorting: true,
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
        enableSorting: true,
      },
      {
        accessorKey: "descripcion",
        header: "Descripción",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="wrap-break-words">
            {row.original.descripcion}
          </span>
        ),
      },
    ];

    if (isAdmin) {
      cols.push({
        id: "acciones",
        header: "Acciones",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEditar(row.original)}
              className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
            >
              Editar
            </button>

            <button
              type="button"
              onClick={() => onEliminar(row.original.id)}
              className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200"
            >
              Eliminar
            </button>
          </div>
        ),
      });
    }
    return cols;
  }, [isAdmin, onEditar, onEliminar]);

  const table = useReactTable({
    data: categoriasFiltradas,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    rowCount: filtro.trim()
      ? categoriasFiltradas.length
      : total,
  });

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-4">
        <input
            type="text"
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value);

              onPaginationChange((prev) => ({
                ...prev,
                pageIndex: 0,
              }));
            }}
            placeholder="Buscar por nombre o descripción..."
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-black outline-none focus:border-blue-500"
        />
      </div>
      <table className="w-full table-fixed border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-100">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`${cellBase} font-medium text-black ${
                    header.column.id === "id"
                      ? "w-20"
                      : header.column.id === "nombre"
                        ? "w-[25%]"
                        : header.column.id === "acciones"
                          ? "w-45"
                          : "w-auto"
                  }`}
                >
                  {header.isPlaceholder ? null : (
                    <button
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      disabled={!header.column.getCanSort()}
                      className="inline-flex items-center gap-1 text-left disabled:cursor-default"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      {header.column.getIsSorted()
                        ? sortLabel[
                            header.column.getIsSorted() as string
                          ]
                        : null}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`${cellBase} text-sm text-black ${
                    cell.column.id === "id"
                      ? "w-20"
                      : cell.column.id === "acciones"
                        ? "w-45"
                        : ""
                  }`}
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}

          {table.getRowModel().rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-gray-500"
              >
                No hay categorías para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-center gap-4 border-t border-gray-200 bg-gray-50 px-4 py-4">
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>

        <span className="text-sm text-gray-600">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount() || 1}
        </span>

        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default CategoriaList;
