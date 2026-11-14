from datetime import UTC, datetime
from decimal import Decimal

from fastapi import HTTPException
from sqlmodel import Session

from app.modules.pedidos.detallePedido.model import DetallePedido
from app.modules.pedidos.model import Pedido
from app.modules.pedidos.schema import (
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedido,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.usuarios.schema import UserPublic


class PedidoService:
    def __init__(self, session: Session) -> None:
        self.session = session

    
    def crear(self, data: PedidoCreate, usuario: UserPublic) -> PedidoRead:

        with PedidoUnitOfWork(self.session) as uow:

            forma_pago = uow.forma_pago.get_by_codigo(data.forma_pago)

            if not forma_pago or not forma_pago.activo:
                raise HTTPException(status_code=400, detail="Forma de pago no válida o inactiva")

            productos_ids = [item.producto_id for item in data.items]

            if len(productos_ids) != len(set(productos_ids)):
                raise HTTPException(status_code=400, detail="No se permiten productos repetidos en el pedido")

            pedido = Pedido(
                usuario_id=usuario.id,
                estado="PENDIENTE",
                forma_pago=forma_pago.codigo,
                direccion_entrega=data.direccion_entrega,
                notas=data.notas,
                total=Decimal("0.00"),
            )

            pedido = uow.pedido.add(pedido)

            if pedido.id is None:
                raise HTTPException(status_code=500, detail="No se pudo obtener el ID del pedido")

            total = Decimal("0.00")

            for item in data.items:
                producto = uow.producto.get_by_id(item.producto_id)
                if not producto or not producto.activo:
                    raise HTTPException(status_code=404, detail=f"Producto con ID {item.producto_id} no encontrado")

                if not producto.disponible:
                    raise HTTPException(status_code=400, detail=f"Producto con ID {item.producto_id} no disponible")

                if producto.stock < item.cantidad:
                    raise HTTPException(status_code=400,detail=f"Stock insuficiente para el producto {producto.nombre}")

                producto.stock -= item.cantidad
                uow.producto.update(producto)

                detalle = DetallePedido(
                    pedido_id=pedido.id,
                    producto_id=item.producto_id,
                    cantidad=item.cantidad,
                    nombre_producto=producto.nombre,
                    precio_unitario=producto.precio_base,
                    subtotal=Decimal(item.cantidad) * producto.precio_base,
                )

                uow.detalle_pedido.add(detalle)

                pedido.items.append(detalle)   

                total += detalle.subtotal

            pedido.total = total
            uow.pedido.update(pedido)

            result = PedidoRead.model_validate(pedido)

        return result



    def obtener_todos(self, usuario: UserPublic, skip: int = 0, limit: int = 10) -> PedidosPaginados:

        with PedidoUnitOfWork(self.session) as uow:

            if usuario.id is None:
                raise HTTPException(status_code=401, detail="Usuario no válido")

            if usuario.role == "admin":
                pedidos = sorted(
                    uow.pedido.get_all(skip=skip, limit=limit),
                    key=lambda pedido: pedido.id or 0,
                )

                total = uow.pedido.count_pedidos()

            else:
                pedidos = uow.pedido.list_by_usuario(
                    usuario_id=usuario.id,
                    skip=skip,
                    limit=limit,
                )
                total = uow.pedido.count_by_usuario(usuario.id)

            result = PedidosPaginados(
                items=[
                    PedidoRead.model_validate(pedido)
                    for pedido in pedidos
                ],
                total=total,
            )

        return result

    def obtener_por_id(self, pedido_id: int, usuario: UserPublic) -> PedidoRead:

        with PedidoUnitOfWork(self.session) as uow:

            pedido = uow.pedido.get_by_id(pedido_id)

            if not pedido:
                raise HTTPException(status_code=404, detail="Pedido no encontrado")

            if usuario.role != "admin" and pedido.usuario_id != usuario.id:
                raise HTTPException(status_code=403, detail="No tenés permisos para consultar este pedido")

            result = PedidoRead.model_validate(pedido)

        return result

    
    def cancelar(self, pedido_id: int, usuario: UserPublic) -> PedidoRead:

        with PedidoUnitOfWork(self.session) as uow:

            pedido = uow.pedido.get_by_id(pedido_id)

            if not pedido:
                raise HTTPException(status_code=404, detail="Pedido no encontrado")

            es_admin = usuario.role == "admin"
            es_propietario = pedido.usuario_id == usuario.id

            if not es_admin and not es_propietario:
                raise HTTPException(status_code=403, detail="No tenés permisos para cancelar este pedido")

            if es_admin:
                estados_cancelables = {
                    "PENDIENTE",
                    "EN_PREPARACION",
                }
            else:
                estados_cancelables = {"PENDIENTE"}

            if pedido.estado not in estados_cancelables:
                raise HTTPException(status_code=409, detail="El pedido no puede cancelarse en su estado actual")

            estado_cancelado = uow.estado.get_by_codigo("CANCELADO")

            if not estado_cancelado:
                raise HTTPException(status_code=500, detail="No se encuentra configurado el estado CANCELADO")

            # Restituir stock
            for detalle in pedido.items:
                producto = uow.producto.get_by_id(detalle.producto_id)

                if producto:
                    producto.stock += detalle.cantidad
                    uow.producto.update(producto)

            pedido.estado = estado_cancelado.codigo
            pedido.updated_at = datetime.now(UTC)

            uow.pedido.update(pedido)

            result = PedidoRead.model_validate(pedido)

        return result

    def obtener_resumen(self) -> ResumenPedido:

        with PedidoUnitOfWork(self.session) as uow:

            pedidos = uow.pedido.get_all()

            pendientes = len([p for p in pedidos if p.estado == "PENDIENTE"])
            en_preparacion = len([p for p in pedidos if p.estado == "EN_PREP"])
            total_cancelados = len([p for p in pedidos if p.estado == "CANCELADO"])
            total_entregados = len([p for p in pedidos if p.estado == "ENTREGADO"])

            result = ResumenPedido.model_validate(
                {
                    "pendientes": pendientes,
                    "en_preparacion": en_preparacion,
                    "entregados": total_entregados,
                    "cancelados": total_cancelados,
                    "pedidos_hoy": len([p for p in pedidos if p.created_at.date() == datetime.now(UTC).date()]),
                    "ingresos_entregados": sum(p.total for p in pedidos if p.estado == "ENTREGADO"),
                }
            )

        return result

    def cambiar_estado(self, pedido_id: int, usuario: UserPublic) -> PedidoRead:

        with PedidoUnitOfWork(self.session) as uow:

            pedido = uow.pedido.get_by_id(pedido_id)

            if not pedido:
                raise HTTPException(status_code=404, detail="Pedido no encontrado")

            if usuario.role != "admin":
                raise HTTPException(status_code=403, detail="No tenés permisos para cambiar el estado del pedido")

            if pedido.estado == "PENDIENTE":
                pedido.estado = "EN_PREP"
            elif pedido.estado == "EN_PREP":
                pedido.estado = "ENTREGADO"
            else:
                raise HTTPException(status_code=409, detail="El pedido no puede avanzar en su estado actual")

            pedido.updated_at = datetime.now(UTC)
            uow.pedido.update(pedido)

            result = PedidoRead.model_validate(pedido)

        return result