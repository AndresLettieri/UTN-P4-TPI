from fastapi import HTTPException
from sqlmodel import Session

from app.modules.productos.model import Producto
from app.modules.productos.schema import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoUpdate,
)
from app.modules.productos.unit_of_work import ProductoUnitOfWork


class ProductoService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def crear(self, data: ProductoCreate) -> ProductoRead:
        with ProductoUnitOfWork(self.session) as uow:
            categoria = uow.categoria.get_by_id(data.categoria_id)
            if not categoria:
                raise HTTPException(status_code=404, detail="Categoria no encontrada")
            nombre = data.nombre
            producto_existente = uow.producto.obtener_por_nombre(nombre)
            if producto_existente:
                raise HTTPException(status_code=409, detail="Producto ya existe")
            
            producto = Producto.model_validate(data)
            uow.producto.add(producto)
            result = ProductoRead.model_validate(producto)

        return result

    def obtener_todos(self, skip: int = 0, limit: int = 10, search: str | None = None, categoria_id: int | None = None) -> ProductosPaginados:
        with ProductoUnitOfWork(self.session) as uow:
            productos = [
                p for p in uow.producto.get_all()
                if p.activo is True
                and (search is None or search.lower() in p.nombre.lower())
                and (categoria_id is None or p.categoria_id == categoria_id)
            ]

            productos.sort(key=lambda p: p.id or 0)

            total = len(productos)
            productos_paginados = productos[skip:skip + limit]

            result = ProductosPaginados.model_validate(
                {
                    "productos": [
                        ProductoRead.model_validate(producto)
                        for producto in productos_paginados
                    ],
                    "total": total,
                }
            )

        return result

    def obtener_por_id(self, producto_id: int) -> ProductoRead:
        with ProductoUnitOfWork(self.session) as uow:
            producto = uow.producto.get_by_id(producto_id)
            if not producto:
                raise HTTPException(status_code=404, detail="Producto no encontrado")
            result = ProductoRead.model_validate(producto)
        return result

    def actualizar(self, producto_id: int, data: ProductoUpdate) -> ProductoRead:
        with ProductoUnitOfWork(self.session) as uow:
            producto = uow.producto.get_by_id(producto_id)

            if not producto:
                raise HTTPException(status_code=404, detail="Producto no encontrado")

            cambios = data.model_dump(exclude_unset=True)
            nombre = cambios.get("nombre", producto.nombre)

            producto_existente = uow.producto.obtener_por_nombre(nombre)
            if producto_existente and producto_existente.id != producto_id:
                raise HTTPException(status_code=409, detail="Producto ya existe")

            for key, value in cambios.items():
                setattr(producto, key, value)

            uow.producto.update(producto)

            result = ProductoRead.model_validate(producto)

        return result

    def eliminar(self, producto_id: int) -> None:
        with ProductoUnitOfWork(self.session) as uow:
            producto = uow.producto.get_by_id(producto_id)
            if not producto:
                raise HTTPException(status_code=404, detail="Producto no encontrado")
            
            producto.activo = False
            uow.producto.update(producto)

