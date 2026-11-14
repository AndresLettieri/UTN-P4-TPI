from datetime import UTC, datetime

from fastapi import HTTPException
from sqlmodel import Session

from app.modules.catalogos.formaPago.model import FormaPago
from app.modules.catalogos.formaPago.schema import (
    FormaPagoCreate,
    FormaPagoRead,
    FormaPagoUpdate,
)
from app.modules.catalogos.formaPago.unit_of_work import FormaPagoUnitOfWork


class FormaPagoService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def obtener_todas(self) -> list[FormaPagoRead]:
        with FormaPagoUnitOfWork(self.session) as uow:
            forma_pagos = uow.forma_pago.get_all()
            forma_pagos = [fp for fp in forma_pagos if fp.activo]
            result = [FormaPagoRead.model_validate(c) for c in forma_pagos]
        return result

    def crear(self,data: FormaPagoCreate) -> FormaPagoRead:
        with FormaPagoUnitOfWork(self.session) as uow:
            forma_pago = FormaPago.model_validate(data)
            uow.forma_pago.add(forma_pago)
            result = FormaPagoRead.model_validate(forma_pago)
        return result

    def actualizar(self, forma_pago_id: int, data: FormaPagoUpdate) -> FormaPagoRead:
        with FormaPagoUnitOfWork(self.session) as uow:
            forma_pago = uow.forma_pago.get_by_id(forma_pago_id)
            if not forma_pago:
                raise HTTPException(status_code=404, detail="Forma de pago no encontrada")

            patch = data.model_dump(exclude_unset=True)
            
            for key, value in patch.items():
                setattr(forma_pago, key, value)

            forma_pago.updated_at = datetime.now(UTC)

            uow.forma_pago.update(forma_pago)
            result = FormaPagoRead.model_validate(forma_pago)
        
        return result

    def eliminar(self, forma_pago_id: int) -> None:
        with FormaPagoUnitOfWork(self.session) as uow:
            forma_pago = uow.forma_pago.get_by_id(forma_pago_id)
            if not forma_pago:
                raise HTTPException(status_code=404, detail="Forma de pago no encontrada")

            uow.forma_pago.soft_delete(forma_pago)