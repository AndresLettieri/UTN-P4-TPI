from fastapi import HTTPException
from sqlmodel import Session

from app.modules.categorias.model import Categoria
from app.modules.categorias.schema import CategoriaCreate, CategoriaList, CategoriaRead
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork
from app.modules.productos.schema import ProductoRead


class CategoriaService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def crear(self, data: CategoriaCreate) -> CategoriaRead:
        with CategoriaUnitOfWork(self.session) as uow:
            categoria = uow.categoria.get_by_nombre(data.nombre)

            if categoria:
                raise HTTPException(status_code=409, detail="La categoría ya existe")

            categoria = Categoria.model_validate(data)
            uow.categoria.add(categoria)

            result = CategoriaRead.model_validate(categoria)

        return result

    def obtener_todas(self, skip: int = 0, limit: int = 10) -> CategoriaList:
        with CategoriaUnitOfWork(self.session) as uow:
            categorias = uow.categoria.get_all_active(skip=skip, limit=limit)
            total = uow.categoria.count_active()

            result = CategoriaList(
                categorias=[
                    CategoriaRead.model_validate(categoria)
                    for categoria in categorias
                ],
                total=total,
            )

        return result

    def obtener_por_id(self, categoria_id: int) -> CategoriaRead:
        with CategoriaUnitOfWork(self.session) as uow:
            categoria = uow.categoria.get_by_id(categoria_id)
            if not categoria:
                raise HTTPException(status_code=404, detail="Categoria no encontrada")
            result = CategoriaRead.model_validate(categoria)
        return result

    def actualizar(self, categoria_id: int, data: CategoriaCreate) -> CategoriaRead:
        with CategoriaUnitOfWork(self.session) as uow:
            categoria = uow.categoria.get_by_id(categoria_id)
            if not categoria:
                raise HTTPException(status_code=404, detail="Categoria no encontrada")

            existing_categoria = uow.categoria.get_by_nombre(data.nombre)
            if existing_categoria and existing_categoria.id != categoria_id:
                raise HTTPException(status_code=409, detail="Categoria ya existe")

            patch = data.model_dump(exclude_unset=True)
          
            for key, value in patch.items():
                setattr(categoria, key, value)

            uow.categoria.update(categoria)
            result = CategoriaRead.model_validate(categoria)
        
        return result

    def eliminar(self, categoria_id: int) -> None:
        with CategoriaUnitOfWork(self.session) as uow:
            categoria = uow.categoria.get_by_id(categoria_id)

            if not categoria or not categoria.activo:
                raise HTTPException(status_code=404, detail="Categoría no encontrada")

            uow.categoria.delete(categoria)

            for producto in categoria.productos:
                uow.producto.delete(producto)

            
    def obtener_productos(self, categoria_id: int) -> list[ProductoRead]:
        with CategoriaUnitOfWork(self.session) as uow:
            categoria = uow.categoria.get_by_id(categoria_id)

            if not categoria or not categoria.activo:
                raise HTTPException(status_code=404, detail="Categoría no encontrada")

            result = [
                ProductoRead.model_validate(producto)
                for producto in categoria.productos
            ]

        return result