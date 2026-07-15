# Proyecto

Este proyecto usa:

- Node.js 22
- Express
- TypeScript
- TypeORM
- MySQL

## Arquitectura back

src/
    controllers/
    services/
    repositories/
    entities/
    routes/
    middlewares/
    test/

## Arquitectura front

src/
    assets/
    components/
    pages/
    layouts/
    hooks/
    services/
    api/
    context/
    routes/
    types/
    utils/
    styles/

test/

## Reglas Backend

- No usar any.
- Siempre usar async/await.
- Todas las respuestas son JSON.
- No escribir lógica en los controllers.
- Toda la lógica vive en services.
- Usar Repository Pattern.
- Los nombres van en inglés.
- No usar console.log.
- Siempre manejar errores.
- Crear DTOs.

## Reglas Front

- No usar `any`; preferir tipos e interfaces.
- Todos los componentes deben estar escritos en TypeScript.
- Usar componentes funcionales y Hooks.
- Mantener los componentes pequeños y con una única responsabilidad.
- Usar siempre SOLID
- No escribir lógica de negocio dentro de los componentes.
- La lógica de negocio debe vivir en `services`.
- Las llamadas a la API deben centralizarse en `api`.
- Siempre usar `async/await` para llamadas asíncronas.
- Manejar todos los errores con `try/catch`.
- No usar `console.log`; utilizar herramientas de depuración o manejo de errores.
- Los nombres de archivos, carpetas, variables y funciones deben estar en inglés.
- Utilizar `camelCase` para variables y funciones.
- Utilizar `PascalCase` para componentes, interfaces y tipos.
- Tipar correctamente las props de todos los componentes.
- No duplicar código; reutilizar componentes y funciones.
- Mantener los estilos separados de la lógica del componente.
- Utilizar variables de entorno (`.env`) para URLs y configuraciones.
- No hardcodear URLs ni valores de configuración.
- Validar los datos antes de enviarlos al backend.
- Definir interfaces o tipos para todas las respuestas de la API.
- Organizar las rutas en un único módulo (`routes`).
- Mantener la estructura del proyecto organizada por responsabilidad (`components`, `pages`, `services`, `hooks`, `types`, etc.).
- Ejecutar ESLint y corregir advertencias antes de realizar un commit.
- Todo archivo debe de tener su prueba unitaria superior al 80% con JEST.