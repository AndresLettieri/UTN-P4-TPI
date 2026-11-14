from sqlmodel import Session, func, select

from app.core.base_repository import BaseRepository
from app.modules.catalogos.formaPago.model import FormaPago


class FormaPagoRepository(BaseRepository[FormaPago]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, FormaPago)

    def get_by_codigo(self, codigo: str) -> FormaPago | None:
         return self.session.exec(
                    select(FormaPago).where(func.lower(FormaPago.codigo) == codigo.lower(), FormaPago.activo == True)
                ).first()

    def soft_delete(self, forma_pago: FormaPago) -> None:
        forma_pago.activo = False
        self.session.add(forma_pago)
        self.session.commit()
    
