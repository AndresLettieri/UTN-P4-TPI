from decimal import Decimal

from sqlmodel import Session

from app.core.database import engine
from app.core.security import hash_password
from app.modules.catalogos.estadoPedido.model import EstadoPedido
from app.modules.catalogos.estadoPedido.unit_of_work import EstadoPedidoUnitOfWork
from app.modules.catalogos.formaPago.model import FormaPago
from app.modules.catalogos.formaPago.unit_of_work import FormaPagoUnitOfWork
from app.modules.categorias.model import Categoria
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork
from app.modules.productos.model import Producto
from app.modules.productos.unit_of_work import ProductoUnitOfWork
from app.modules.usuarios.model import Usuario
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


def seed_data() -> None:
    with FormaPagoUnitOfWork(Session(engine)) as uow:
        # Formas de pago
        formas_pago = [
            ("EFECTIVO", "Efectivo"),
            ("TRANSFERENCIA", "Transferencia bancaria"),
        ]

        for codigo, descripcion in formas_pago:
            if uow.forma_pago.get_by_codigo(codigo) is None:
                uow.forma_pago.add(
                    FormaPago(
                        codigo=codigo,
                        descripcion=descripcion,
                        activo=True,
                    )
                )

    with EstadoPedidoUnitOfWork(Session(engine)) as uow:
        # Estados de pedido
        estados = [
            ("PENDIENTE", "Pendiente", 1, False),
            ("EN_PREP", "En preparación", 2, False),
            ("ENTREGADO", "Entregado", 3, True),
            ("CANCELADO", "Cancelado", 4, True),
        ]

        for codigo, descripcion, orden, es_terminal in estados:
            if uow.estado_pedido.get_by_codigo(codigo) is None:
                uow.estado_pedido.add(
                    EstadoPedido(
                        codigo=codigo,
                        descripcion=descripcion,
                        orden=orden,
                        es_terminal=es_terminal,
                    )
                )
    with CategoriaUnitOfWork(Session(engine)) as uow:
        # Categorías
        categorias = [
            ("Bebidas sin alcohol", "Gaseosas, aguas y jugos"),
            ("Bebidas alcohólicas", "Cervezas, vinos y aperitivos"),
            ("Energizantes", "Bebidas energéticas e isotónicas"),
        ]

        for nombre, descripcion in categorias:
            if uow.categoria.get_by_nombre(nombre) is None:
                uow.categoria.add(
                    Categoria(
                        nombre=nombre,
                        descripcion=descripcion,
                    )
                )

    with ProductoUnitOfWork(Session(engine)) as uow:
        # Productos
        productos = [
            ("Coca Cola", "Gaseosa Coca Cola 2.25L", 1500.0, 1,10),
            ("Sprite", "Gaseosa Sprite 2.25L", 1400.0, 1, 10),
            ("Fernet", "Fernet Branca 750ml", 2500.0, 2, 10),
            ("Red Bull", "Bebida energizante Red Bull 250ml", 3000.0, 3, 10),
            ("Agua Mineral", "Agua mineral sin gas 500ml", 1000.0, 1, 10),
            ("Cerveza", "Cerveza lager 330ml", 1200.0, 2, 10),
            ("Vino Tinto", "Vino tinto Malbec 750ml", 3500.0, 2, 10),
            ("Whisky", "Whisky escocés 750ml", 5000.0, 2, 10),
        ]

        for nombre, descripcion, precio_base, categoria_id, stock in productos:
            if uow.producto.obtener_por_nombre(nombre) is None:
                uow.producto.add(
                    Producto(
                        nombre=nombre,
                        descripcion=descripcion,
                        precio_base=Decimal(str(precio_base)),
                        categoria_id=categoria_id,
                        stock=stock,
                    )
                )

    with UsuarioUnitOfWork(Session(engine)) as uow:
        usuarios = [
            ("admin", "admin", "admin@example.com", "Admin1234!", "admin"),
        ]

        for username, full_name, email, password, role in usuarios:
            if uow.usuario.obtener_por_email(email) is None:
                uow.usuario.add(
                    Usuario(
                        username=username,
                        full_name=full_name,
                        email=email,
                        hashed_password=hash_password(password),
                        role=role,
                    )
                )
            

    
    print("Datos iniciales cargados correctamente.")


if __name__ == "__main__":
    seed_data()
