interface EstadoPedidoProps {
  estado: string;
}

const estilosEstado: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  EN_PREPARACION: "bg-blue-100 text-blue-800",
  ENTREGADO: "bg-green-100 text-green-800",
  CANCELADO: "bg-red-100 text-red-800",
};

const nombresEstado: Record<string, string> = {
  PENDIENTE: "Pendiente",
  EN_PREP: "En preparación",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export default function EstadoPedido({ estado }: EstadoPedidoProps) {
  const estilo =
    estilosEstado[estado] ?? "bg-zinc-100 text-zinc-700";

  const nombre = nombresEstado[estado] ?? estado;

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${estilo}`}
    >
      {nombre}
    </span>
  );
}