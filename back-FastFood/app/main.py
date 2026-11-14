from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import create_db_and_tables
from app.db.seed import seed_data
from app.modules.auth.router import router as auth_router
from app.modules.catalogos.estadoPedido.model import EstadoPedido
from app.modules.catalogos.formaPago.model import FormaPago
from app.modules.catalogos.router import router as catalogo_router
from app.modules.categorias.router import router as categoria_router
from app.modules.pedidos.detallePedido.model import DetallePedido
from app.modules.pedidos.router import router as pedido_router
from app.modules.productos.router import router as producto_router
from app.modules.usuarios.router import router as usuario_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    seed_data()
    yield


app = FastAPI(
    title="API Productos",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(usuario_router, prefix="/api/v1/usuarios", tags=["usuarios"])
app.include_router(categoria_router, prefix="/api/v1/categorias", tags=["categorias"])
app.include_router(producto_router, prefix="/api/v1/productos", tags=["productos"])
app.include_router(pedido_router, prefix="/api/v1/pedidos", tags=["pedidos"])
app.include_router(catalogo_router, prefix="/api/v1/catalogo", tags=["catalogo"])


@app.get("/")
def root():
    return {"mensaje": "API funcionando"}