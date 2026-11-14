# Food Store - Backend

API REST para la aplicación **Food Store**, desarrollada con FastAPI. Se encarga de gestionar la lógica de negocio, la persistencia de datos y la comunicación con el frontend.

El backend centraliza las operaciones relacionadas con usuarios, productos, categorías, carrito de compras y pedidos, aplicando las validaciones correspondientes y controlando el acceso según los permisos de cada usuario.

## Funcionalidades

### Autenticación y usuarios
- Registro de usuarios.
- Inicio y cierre de sesión.
- Autenticación mediante cookies de sesión.
- Consulta de la sesión activa.
- Gestión de usuarios.
- Control de acceso según roles.

### Productos y categorías
- Consulta de productos.
- Búsqueda y filtrado de productos.
- Paginación de resultados.
- Consulta de productos por identificador.
- Alta, modificación y baja lógica de productos.
- Gestión de categorías.

### Pedidos
- Creación de pedidos.
- Validación de productos, disponibilidad y stock.
- Cálculo del importe total en el servidor.
- Descuento de stock al confirmar una compra.
- Consulta de pedidos.
- Consulta del detalle de cada pedido.
- Cancelación de pedidos con restitución del stock.
- Actualización del estado de los pedidos.
- Validación de permisos y transiciones de estado.

## Tecnologías utilizadas

- **Python:** lenguaje de programación.
- **FastAPI:** framework para el desarrollo de la API REST.
- **SQLModel:** modelado de entidades y acceso a datos.
- **PostgreSQL:** sistema de gestión de base de datos.
- **Pydantic:** validación y serialización de datos.

## Arquitectura

El proyecto organiza sus responsabilidades en módulos, separando las distintas capas de la aplicación:

- **Routers:** definen los endpoints y reciben las solicitudes HTTP.
- **Schemas:** establecen los modelos de entrada y salida, y validan los datos.
- **Services:** contienen la lógica de negocio.
- **Repositories:** encapsulan las operaciones de acceso a datos.
- **Unit of Work:** administra las operaciones y transacciones sobre la base de datos.
- **Models:** representan las entidades persistidas.

## Requisitos previos

- Python 3.10 o superior.
- PostgreSQL.
- pip.

## Instalación y ejecución

1. Ingresar al directorio del backend:

```bash
cd back-FastFood
```

3. Crear un entorno virtual:

```bash
python -m venv venv
```

4. Activar el entorno virtual:

```bash
venv\Scripts\activate
```


5. Instalar las dependencias:

```bash
pip install -r requirements.txt
```

6. Configurar las variables de entorno necesarias para la conexión a la base de datos y el funcionamiento de la aplicación en un archivo .env.

7. Ejecutar el servidor:

```bash
uvicorn app.main:app --reload
```

> El comando de ejecución y la ruta del módulo principal deben coincidir con la estructura real del proyecto.

## Documentación de la API

FastAPI genera automáticamente la documentación interactiva de los endpoints.

Con el servidor en ejecución, se puede acceder a:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

## Base de datos

La aplicación utiliza PostgreSQL para almacenar la información de usuarios, productos, categorías y pedidos.

La conexión se configura mediante variables de entorno, evitando incluir credenciales directamente en el código fuente.
