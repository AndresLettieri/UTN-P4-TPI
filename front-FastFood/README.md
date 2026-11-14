# Food Store

Aplicación web para la gestión de una tienda de alimentos. Permite administrar el catálogo de productos, gestionar pedidos y realizar compras mediante una interfaz web.

El sistema cuenta con distintos perfiles de usuario, con funcionalidades y permisos específicos para cada uno.

## Funcionalidades

### Catálogo y compras
- Consulta del catálogo de productos.
- Búsqueda y filtrado por categoría.
- Visualización de disponibilidad y stock.
- Carrito de compras para usuarios registrados y visitantes.
- Validación de stock antes de confirmar la compra.
- Registro de pedidos con dirección de entrega y forma de pago.

### Usuarios
- Registro e inicio de sesión.
- Autenticación mediante sesión y cookies.
- Acceso a funcionalidades según el rol del usuario.
- Consulta del historial de pedidos.
- Cancelación de pedidos según su estado.

### Administración
- Panel de administración.
- Gestión de categorías.
- Alta, edición y baja de productos.
- Gestión de usuarios.
- Consulta y administración de pedidos.
- Actualización del estado de los pedidos.

## Tecnologías utilizadas

- **React 19:** construcción de la interfaz de usuario.
- **TypeScript:** tipado estático.
- **Vite:** entorno de desarrollo y compilación.
- **Tailwind CSS 4:** estilos y diseño responsive.
- **React Router 7:** navegación y protección de rutas.
- **TanStack Query:** gestión de consultas y estado del servidor.
- **TanStack Form:** manejo de formularios.
- **Zustand:** gestión del estado global, incluyendo autenticación y carrito.
- **Axios:** comunicación con la API.


## Estructura del proyecto

```text
src/
├── components/
│   ├── routes/
│   └── ...
├── features/
│   ├── auth/
│   ├── carrito/
│   ├── catalogo/
│   ├── categorias/
│   ├── pedidos/
│   ├── productos/
│   └── usuarios/
├── store/
│   ├── authStore.ts
│   └── cartStore.ts
├── App.tsx
├── main.tsx
└── index.css
```

La aplicación organiza sus funcionalidades por módulos dentro de `features`, separando componentes, páginas, servicios, tipos y hooks según corresponda.

## Requisitos previos

- Node.js
- npm
- Backend de Food Store en funcionamiento.

## Instalación y ejecución


1. Ingresar al directorio del proyecto:

```bash
cd front-FastFood
```

2. Instalar las dependencias:

```bash
npm install
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en la dirección indicada por Vite, normalmente:

```text
http://localhost:5173
```

## Configuración de la API

El frontend se comunica con el backend mediante una API REST.

La URL base utilizada durante el desarrollo es:

```text
http://localhost:8000/api/v1
```

Para utilizar la aplicación, el backend debe estar ejecutándose y contar con su base de datos configurada.

## Roles de usuario

| Rol | Permisos principales |
|---|---|
| Usuario | Consultar catálogo, comprar y gestionar sus pedidos. |
| Administrador | Acceder a las funcionalidades de administración y gestionar pedidos. También puede realizar compras como un usuario común. |
