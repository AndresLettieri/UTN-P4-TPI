import { useMemo, useState } from "react";
import type { Usuario } from "../usuarios/types/usuario";
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

interface UsuarioListProps {
  usuarios: Usuario[];
  total: number;
  pagination: PaginationState;
  onPaginationChange: (updater: Updater<PaginationState>) => void;
  onActivar: (id: number) => void;
  onDesactivar: (id: number) => void;
  currentUserId?: number;
  isProcessing: boolean;
}

const sortLabel: Record<string, string> = {
  asc: " ↑",
  desc: " ↓",
};

const cellBase = "border-b border-gray-200 px-6 py-3 text-left";

function UsuarioList({
  usuarios,
  total,
  pagination,
  onPaginationChange,
  onActivar,
  onDesactivar,
  currentUserId,
  isProcessing,
}: UsuarioListProps) {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtro, setFiltro] = useState("");

  const usuariosFiltrados = useMemo(() => {
    const busqueda = filtro.trim().toLowerCase();

    if (!busqueda) return usuarios;

    return usuarios.filter((usuario) => {
      const username = usuario.username?.toLowerCase() ?? "";
      const fullname = usuario.full_name?.toLowerCase() ?? "";
      const email = usuario.email?.toLowerCase() ?? "";
      const role = usuario.role?.toLowerCase() ?? "";
      const disabled = usuario.disabled ?? false;

      return (
        username.includes(busqueda) ||
        fullname.includes(busqueda) ||
        email.includes(busqueda) ||
        role.includes(busqueda) ||
        (disabled ? "inactivo" : "activo").includes(busqueda)
      );
    });
  }, [usuarios, filtro]);



  const columns = useMemo<ColumnDef<Usuario>[]>(() => [
    {
      accessorKey: "id",
      header: "ID",
      enableSorting: true,
    },
    {
      accessorKey: "username",
      header: "Usuario",
      enableSorting: true,
      cell: ({ row }) =>
        `${row.original.username}`,
    },
    {
      accessorKey: "full_name",
      header: "Nombre",
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: true,
    },
    {
      accessorKey: "role",
      header: "Rol",
      enableSorting: true,
    },
    {
      id: "estado",
      header: "Estado",
      enableSorting: true,
      cell: ({ row }) => {
        const activo = row.original.disabled === false;

        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
              activo
                ? "bg-green-100 text-green-700"
                : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {activo ? "Activo" : "Inactivo"}
          </span>
        );
      },
    },
    {
      id: "acciones",
      header: "Acciones",
      enableSorting: false,
      cell: ({ row }) => {
        const usuario = row.original;
        const activo = usuario.disabled === false;
        
        if (usuario.id === currentUserId) {
          return (
            <span className="text-xs text-zinc-400">
              Sesión actual
            </span>
          );
        }

        return activo ? (
        <button
          disabled={isProcessing}
          onClick={() => onDesactivar(usuario.id)}
          className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-200"
        >
          Desactivar
        </button>
        ) : (
          <button
            type="button"
            onClick={() => onActivar(usuario.id)}
            className="rounded-md bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 transition hover:bg-green-200"
          >
            Activar
          </button>
        );
      },
    },
  ], [onActivar, onDesactivar, currentUserId, isProcessing]);

  const table = useReactTable({
    data: usuariosFiltrados,
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
      ? usuariosFiltrados.length
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
          placeholder="Buscar por nombre, usuario o email..."
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-black outline-none focus:border-violet-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
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
                          : header.column.id === "email"
                            ? "w-[30%]"
                            : header.column.id === "estado"
                              ? "w-[15%]"
                              : header.column.id === "acciones"
                                ? "w-36"
                                : ""
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
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`${cellBase} text-sm text-black`}
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
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No hay usuarios para mostrar.
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
    </div>
  );
}

export default UsuarioList;
