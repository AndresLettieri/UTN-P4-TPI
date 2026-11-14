# Food Store

**Sistema de gestión y venta de productos alimenticios**

Food Store es una aplicación web desarrollada para administrar una tienda de alimentos, permitiendo gestionar productos, categorías, usuarios y pedidos desde una única plataforma.

El sistema ofrece un catálogo de productos para los clientes y un panel de administración para gestionar las operaciones del negocio. Está desarrollado con una arquitectura cliente-servidor, separando el frontend del backend mediante una API REST.

- [**Link al video presentacion**](https://drive.google.com/file/d/1ed0dV5Oy7V1HX2y1J6U6kaGoeel3bflU/view?usp=drive_link)


## Características principales

### 🛒 Para clientes
- Consulta del catálogo de productos.
- Búsqueda y filtrado por categorías.
- Carrito de compras.
- Registro e inicio de sesión.
- Confirmación de pedidos.
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
- Validaciones de negocio en el backend.

## Tecnologías utilizadas

<details>
<summary><strong>Frontend</strong></summary>

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router
- TanStack Query
- TanStack Form
- Zustand
- Axios

</details>

<details>
<summary><strong>Backend</strong></summary>

- Python
- FastAPI
- SQLModel
- Pydantic
- PostgreSQL

</details>

## Arquitectura del proyecto

El sistema está dividido en dos aplicaciones independientes:

```text
Food Store
│
├── Frontend
│   └── Aplicación web
│       ├── Interfaz de usuario
│       ├── Catálogo
│       ├── Carrito
│       ├── Gestión de pedidos
│       └── Panel de administración
│
└── Backend
    └── API REST
        ├── Autenticación y usuarios
        ├── Productos y categorías
        ├── Gestión de pedidos
        ├── Lógica de negocio
        └── Persistencia de datos
```

El frontend consume los servicios del backend mediante solicitudes HTTP. El backend centraliza las reglas de negocio, las validaciones y el acceso a la base de datos.

## Repositorios

| Componente | Descripción |
|---|---|
| Frontend | Aplicación web desarrollada con React y TypeScript. |
| Backend | API REST desarrollada con FastAPI y Python. |

- **Frontend:** [Ver repositorio](https://github.com/AndresLettieri/UTN-P4-TPI/tree/48aa5a001291e88c60849df3df06ad36cffcd0b4/front-FastFood)
- **Backend:** [Ver repositorio](https://github.com/AndresLettieri/UTN-P4-TPI/tree/48aa5a001291e88c60849df3df06ad36cffcd0b4/back-FastFood)

## Documentación e instalación

Cada repositorio cuenta con su propio README, donde se detallan los requisitos, las tecnologías, la configuración y los pasos necesarios para ejecutar cada aplicación.

- [Documentación del Frontend](https://github.com/AndresLettieri/UTN-P4-TPI/blob/48aa5a001291e88c60849df3df06ad36cffcd0b4/front-FastFood/README.md)
- [Documentación del Backend](https://github.com/AndresLettieri/UTN-P4-TPI/blob/48aa5a001291e88c60849df3df06ad36cffcd0b4/back-FastFood/README.md)

## Estado del proyecto

Proyecto académico desarrollado como trabajo práctico integrador, con el objetivo de aplicar conocimientos de desarrollo frontend, backend, diseño de API REST, persistencia de datos y arquitectura de aplicaciones web.

---

