from datetime import UTC, datetime

from fastapi import HTTPException
from sqlmodel import Session

from app.modules.auth.schema import UserPublic
from app.modules.usuarios.schema import (
    UserList,
    UserUpdate,
)
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class UsuarioService:
    def __init__(self, session: Session) -> None:
        self.session = session

    
    def obtener_todos(self, skip: int = 0, limit: int = 10) -> UserList:
        with UsuarioUnitOfWork(self.session) as uow:
            usuarios = uow.usuario.get_all(skip=skip, limit=limit)
            
            total = uow.usuario.count_all()
            result = UserList(
                usuarios=[UserPublic.model_validate(usuario) for usuario in usuarios],
                total=total
            )
        return result

    def obtener_por_email(self, email: str) -> UserPublic:
        with UsuarioUnitOfWork(self.session) as uow:
            usuario = uow.usuario.obtener_por_email(email)
            if not usuario:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")
            result = UserPublic.model_validate(usuario)
        return result

    def obtener_por_id(self, usuario_id: int) -> UserPublic:
        with UsuarioUnitOfWork(self.session) as uow:
            usuario = uow.usuario.get_by_id(usuario_id)
            if not usuario:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")
           
            result = UserPublic.model_validate(usuario)
        return result

    def actualizar(self, usuario_id: int, data: UserUpdate) -> UserPublic:
        with UsuarioUnitOfWork(self.session) as uow:
            usuario = uow.usuario.get_by_id(usuario_id)
            if not usuario:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")

            existing_usuario = uow.usuario.obtener_por_email(data.email) if data.email is not None else None
            if existing_usuario and existing_usuario.id != usuario_id:
                raise HTTPException(status_code=409, detail="Email ya existe")

            existing_usuario = uow.usuario.obtener_por_username(data.username) if data.username is not None else None
            if existing_usuario and existing_usuario.id != usuario_id:
                raise HTTPException(status_code=409, detail="Username ya existe")

            patch = data.model_dump(exclude_unset=True)
            
            for key, value in patch.items():
                setattr(usuario, key, value)

            usuario.updated_at = datetime.now(UTC)

            uow.usuario.update(usuario)
            result = UserPublic.model_validate(usuario)
        
        return result

    def activar(self, usuario_id: int) -> UserPublic:
        return self._cambiaEstado(usuario_id, True)

    def desactivar(self, usuario_id: int) -> UserPublic:
        return self._cambiaEstado(usuario_id, False)


    def _cambiaEstado(self, usuario_id: int, estado: bool) -> UserPublic:
        with UsuarioUnitOfWork(self.session) as uow:
            usuario = uow.usuario.get_by_id(usuario_id)
            if not usuario:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")
            
            usuario.disabled = not estado
            uow.usuario.update(usuario)
            result = UserPublic.model_validate(usuario)
        return result

    def eliminar(self, usuario_id: int) -> None:
        with UsuarioUnitOfWork(self.session) as uow:
            usuario = uow.usuario.get_by_id(usuario_id)
            if not usuario:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")

            usuario.disabled = True
            uow.usuario.update(usuario)
