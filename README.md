# Food Store

**Sistema de gestión y venta de productos alimenticios**

Food Store es una aplicación web desarrollada para administrar una tienda de alimentos. Permite gestionar productos, categorías, usuarios y pedidos desde una única plataforma.

El sistema ofrece un catálogo de productos para los clientes y un panel de administración para gestionar las operaciones del negocio. Está desarrollado con una arquitectura cliente-servidor, separando el frontend del backend mediante una API REST.

🎥 **[Ver video de presentación](https://drive.google.com/file/d/1ed0dV5Oy7V1HX2y1J6U6kaGoeel3bflU/view?usp=drive_link)**

---

## Características principales

### 🛒 Para clientes

- Consulta del catálogo de productos.
- Búsqueda y filtrado por categorías.
- Visualización de disponibilidad y stock.
- Carrito de compras para usuarios registrados y visitantes.
- Registro e inicio de sesión.
- Confirmación de pedidos con dirección de entrega y forma de pago.
- Consulta del historial de compras.
- Cancelación de pedidos según su estado.

### ⚙️ Para administradores

- Panel de administración.
- Gestión de productos y categorías.
- Gestión de usuarios.
- Consulta y administración de pedidos.
- Actualización de estados de los pedidos.

### 🔐 Seguridad y validaciones

- Autenticación mediante sesiones y cookies.
- Control de acceso basado en roles.
- Protección de rutas y funcionalidades.
- Validación de disponibilidad y stock.
- Validación de reglas de negocio en el backend.
- Cálculo del importe de los pedidos en el servidor.

---

## Tecnologías utilizadas

### Frontend

| Tecnología | Descripción |
|---|---|
| React 19 | Construcción de interfaces de usuario. |
| TypeScript | Tipado estático. |
| Vite | Entorno de desarrollo y compilación. |
| Tailwind CSS 4 | Estilos y diseño responsive. |
| React Router 7 | Navegación y protección de rutas. |
| TanStack Query | Gestión de consultas y estado del servidor. |
| TanStack Form | Manejo de formularios. |
| Zustand | Gestión del estado global. |
| Axios | Comunicación con la API. |

### Backend

| Tecnología | Descripción |
|---|---|
| Python | Lenguaje de programación. |
| FastAPI | Framework para el desarrollo de la API REST. |
| SQLModel | Modelado de entidades y acceso a datos. |
| Pydantic | Validación y serialización de datos. |
| PostgreSQL | Sistema de gestión de base de datos. |

---

## Arquitectura del proyecto

El proyecto está organizado en dos aplicaciones independientes que se comunican mediante una API REST.

```text
UTN-P4-TPI/
│
├── front-FastFood/
│   └── Aplicación web (React + TypeScript)
│       ├── components/
│       ├── features/
│       ├── store/
│       ├── App.tsx
│       └── main.tsx
│
├── back-FastFood/
│   └── API REST (FastAPI)
│       ├── app/
│       │   ├── models/
│       │   ├── schemas/
│       │   ├── routers/
│       │   ├── services/
│       │   └── repositories/
│       ├── requirements.txt
│       └── ...
│
├── .gitignore
└── README.md
```

El frontend se encarga de la interfaz y la interacción con los usuarios. El backend centraliza las reglas de negocio, las validaciones, la autenticación y el acceso a la base de datos.

### Organización del frontend

La aplicación frontend organiza sus funcionalidades por módulos dentro de `features`, separando componentes, páginas, servicios, tipos y hooks según corresponda.

Entre sus principales módulos se encuentran:

- `auth`: autenticación y gestión de sesión.
- `catalogo`: consulta y visualización de productos.
- `carrito`: administración del carrito de compras.
- `productos`: gestión de productos.
- `categorias`: gestión de categorías.
- `pedidos`: creación y administración de pedidos.
- `usuarios`: gestión de usuarios.

### Organización del backend

El backend separa sus responsabilidades en distintas capas:

- **Models:** representan las entidades persistidas.
- **Schemas:** definen los modelos de entrada y salida y validan los datos.
- **Routers:** definen los endpoints y reciben las solicitudes HTTP.
- **Services:** contienen la lógica de negocio.
- **Repositories:** encapsulan las operaciones de acceso a datos.
- **Unit of Work:** administra las operaciones y transacciones sobre la base de datos.

---

## Requisitos previos

Para ejecutar el proyecto se necesitan las siguientes herramientas:

- Node.js.
- npm.
- Python 3.10 o superior.
- pip.
- PostgreSQL.

También es necesario contar con la base de datos configurada y el archivo de variables de entorno del backend.

---

## Instalación y ejecución

El frontend y el backend se ejecutan de manera independiente. Para utilizar la aplicación, ambos deben estar en funcionamiento.

### 1. Clonar el repositorio

```bash
git clone https://github.com/AndresLettieri/UTN-P4-TPI.git
```

Ingresar al directorio principal:

```bash
cd UTN-P4-TPI
```

### 2. Configurar y ejecutar el backend

Ingresar al directorio:

```bash
cd back-FastFood
```

Crear un entorno virtual:

```bash
python -m venv venv
```

Activar el entorno virtual.

**Windows:**

```bash
venv\Scripts\activate
```

**Linux / macOS:**

```bash
source venv/bin/activate
```

Instalar las dependencias:

```bash
pip install -r requirements.txt
```

Crear y configurar el archivo `.env` con los datos de conexión a PostgreSQL y las demás variables requeridas por la aplicación.

Iniciar el servidor:

```bash
uvicorn app.main:app --reload
```

El backend estará disponible en:

```text
http://localhost:8000
```

### 3. Configurar y ejecutar el frontend

Abrir una nueva terminal e ingresar al directorio:

```bash
cd front-FastFood
```

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible normalmente en:

```text
http://localhost:5173
```

### 4. Configuración de la API

El frontend se comunica con el backend mediante solicitudes HTTP.

La URL base utilizada durante el desarrollo es:

```text
http://localhost:8000/api/v1
```

Para utilizar la aplicación, el backend debe estar ejecutándose y tener correctamente configurada la conexión con PostgreSQL.

---

## Documentación de la API

FastAPI genera automáticamente documentación interactiva de los endpoints.

Con el backend en funcionamiento, se puede acceder a:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## Roles de usuario

El sistema contempla dos roles con diferentes permisos:

| Rol | Permisos principales |
|---|---|
| Usuario | Consultar el catálogo, realizar compras y gestionar sus propios pedidos. |
| Administrador | Acceder a las funcionalidades de administración, gestionar productos, categorías, usuarios y pedidos. También puede realizar compras como un usuario común. |

---

## Estructura de repositorios

El proyecto se encuentra organizado en un único repositorio, con el frontend y el backend separados en sus respectivos directorios.

- **[Frontend - front-FastFood](./front-FastFood):** aplicación web desarrollada con React y TypeScript.
- **[Backend - back-FastFood](./back-FastFood):** API REST desarrollada con FastAPI y Python.

Cada módulo cuenta con su propio archivo README para consultar información específica sobre su implementación.

---

## Estado del proyecto

Proyecto académico desarrollado como Trabajo Práctico Integrador de la materia Programación IV, con el objetivo de aplicar conocimientos de desarrollo frontend, backend, diseño de API REST, persistencia de datos y arquitectura de aplicaciones web.

---

**Food Store** — Sistema de gestión y venta de productos alimenticios.