from sqlmodel import Session

from app.core.unit_of_work import UnitOfWork
from app.modules.catalogos.formaPago.repository import FormaPagoRepository


class FormaPagoUnitOfWork(UnitOfWork):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.session = session
        self.forma_pago = FormaPagoRepository(session)
