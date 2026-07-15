# Plan de trabajo — Sistema de gestión de tickets

Basado en [`user-stories-refined.md`](./user-stories-refined.md). Las tareas están ordenadas por dependencia: cada fase asume que las anteriores están completas. Dentro de cada fase, backend y frontend se separan explícitamente porque el frontend consume los contratos que expone el backend.

Convenciones:
- **HU-XX** referencia la historia de usuario de la que se deriva la tarea.
- **Pruebas unitarias** indica qué se cubre con Jest (>80% por archivo, según regla del proyecto).
- 🔒 marca ajustes de seguridad.

---

## Fase 0 — Fundamentos e infraestructura

Sin esta fase nada más puede construirse: define la arquitectura sobre la que corren todas las historias.

### Backend
1. Inicializar proyecto Node 22 + TypeScript + Express (`tsconfig.json` estricto, sin `any`).
2. Configurar TypeORM + conexión MySQL (`data-source.ts`), variables de entorno vía `.env` (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `JWT_EXPIRES_IN`).
3. Crear estructura de carpetas según `CLAUDE.md`: `controllers/`, `services/`, `repositories/`, `entities/`, `routes/`, `middlewares/`, `test/`.
4. Middleware global de manejo de errores (formato JSON uniforme: `{ success, data, error }`).
5. Middleware de logging (sin `console.log`; usar un logger, ej. `pino`/`winston`).
6. 🔒 Configurar `helmet`, `cors` (whitelist de orígenes desde `.env`), `express-rate-limit` en rutas sensibles (login, registro).

**Pruebas unitarias:** middleware de manejo de errores (casos de error conocido/desconocido); helper de respuesta JSON.

### Frontend
1. Confirmar scaffold Vite + React 19 + TS (ya existe en `frontend/`).
2. Crear estructura de carpetas según `CLAUDE.md`: `components/`, `pages/`, `layouts/`, `hooks/`, `services/`, `api/`, `context/`, `routes/`, `types/`, `utils/`, `styles/`.
3. Instalar y configurar `react-router-dom` (rutas), cliente HTTP (`fetch` o `axios`) centralizado en `api/`.
4. Configurar `.env` (`VITE_API_BASE_URL`) — nunca hardcodear URLs.
5. Configurar Jest + Testing Library (React 19 + TS) y umbral de cobertura 80% en `jest.config`.
6. Definir `AuthContext` (estado de sesión) y `PrivateRoute` para proteger rutas autenticadas.

**Pruebas unitarias:** util de formateo/validación compartidos; cliente API base (mock de `fetch`).

---

## Fase 1 — Autenticación (HU-01, HU-02)

Depende de Fase 0. Debe completarse antes de tickets porque el módulo de tickets necesita usuarios existentes y el middleware de JWT.

### Backend
1. Entidad `User` (id, name, email único, passwordHash, role: `admin | user`, timestamps).
2. `UserRepository` (TypeORM Repository Pattern).
3. DTOs: `RegisterUserDto`, `LoginUserDto` (con `class-validator`).
4. `AuthService`: registro (hash con `bcrypt`), validación de credenciales, emisión de JWT.
5. `AuthController` (`POST /auth/register`, `POST /auth/login`) — sin lógica de negocio, solo delegación a `AuthService`.
6. Middleware `authenticate` (verifica JWT) y `authorize(role)` (control de acceso por rol admin/usuario).
7. 🔒 Password hashing con `bcrypt` (salt rounds ≥ 10); nunca devolver `passwordHash` en respuestas.
8. 🔒 JWT firmado con secreto desde `.env`, expiración corta + rotación; cookie `httpOnly`, `secure`, `sameSite=strict` si se usa cookie (alineado con criterio de HU-01 sobre JWT en cookie o localStorage cifrado).
9. 🔒 Validación estricta de fortaleza de contraseña en el DTO (mín. 8 caracteres, 1 especial, 1 numérico — según historia original) y sanitización de `email`.

**Pruebas unitarias:** `AuthService` (registro exitoso, correo duplicado, credenciales inválidas, generación/verificación de JWT); `authenticate`/`authorize` middlewares; validación de DTOs.

### Frontend
1. Tipos `User`, `AuthCredentials`, `RegisterPayload` en `types/`.
2. `api/authApi.ts` — llamadas centralizadas a `/auth/register` y `/auth/login`.
3. `services/authService.ts` — lógica de negocio (persistencia de token, decodificación de rol).
4. `context/AuthContext.tsx` — estado global de sesión, `login`, `logout`, `register`.
5. Página `RegisterPage`: formulario con confirmación de contraseña, validación antes de enviar.
6. Página `LoginPage`: formulario con botón de mostrar/ocultar contraseña.
7. `PrivateRoute` / redirección según rol (admin vs usuario).
8. 🔒 Si se usa `localStorage`, cifrar el token (ej. `crypto-js`) antes de guardarlo; si se usa cookie, dejar que el backend la gestione como `httpOnly` (el frontend no debe leerla directamente).
9. 🔒 Nunca loguear el token ni la contraseña; limpiar formularios de contraseña tras error.

**Pruebas unitarias:** `authService` (guardar/leer/limpiar sesión); `AuthContext` (transiciones de estado login/logout); formularios `RegisterPage`/`LoginPage` (validación de campos, confirmación de contraseña, toggle de visibilidad).

---

## Fase 2 — CRUD de tickets (HU-03, HU-05, HU-06)

Depende de Fase 1 (requiere usuarios para "asignado a" y autenticación en las rutas).

### Backend
1. Entidad `Ticket` (id, title, description, priority, status, assignedTo → relación con `User`, resolvedReason, closedReason, isModified, timestamps).
2. `TicketRepository` (Repository Pattern).
3. DTOs: `CreateTicketDto`, `UpdateTicketDto` (validación de campos obligatorios y enums de `priority`/`status`).
4. `TicketService`: crear, actualizar (marcando `isModified=true` y guardando motivo de modificación), eliminar, obtener por id.
5. `TicketController` (`POST /tickets`, `PATCH /tickets/:id`, `DELETE /tickets/:id`, `GET /tickets/:id`) protegido por `authenticate`.
6. Validar que `assignedTo` exista como usuario real antes de asignar.
7. 🔒 Autorización: solo usuarios autenticados pueden mutar tickets; sanitizar/validar todos los campos de entrada (protección contra inyección vía TypeORM query builder parametrizado, nunca concatenar SQL).

**Pruebas unitarias:** `TicketService` (creación válida/; validación de campos requeridos; actualización con motivo de modificación; eliminación de ticket existente/inexistente); DTOs de validación.

### Frontend
1. Tipos `Ticket`, `TicketPriority`, `TicketStatus`, `CreateTicketPayload`, `UpdateTicketPayload`.
2. `api/ticketApi.ts` — CRUD centralizado.
3. `services/ticketService.ts` — lógica de negocio (formateo, reglas de transición válidas).
4. `pages/TicketFormPage` (crear/editar) con validación de campos antes de enviar y captura obligatoria de "motivo de modificación" al editar.
5. `components/TicketBadge` (indicador visual "editado").
6. Confirmación modal antes de eliminar (HU-06).

**Pruebas unitarias:** `ticketService` (formateo, validaciones); `TicketFormPage` (validación de formulario, envío, manejo de error); `components/TicketBadge`.

---

## Fase 3 — Historial de cambios (HU-07, HU-08)

Depende de Fase 2 (los cambios de estado se disparan desde el CRUD de tickets).

### Backend
1. Entidad `TicketHistory` (ticketId, previousStatus, newStatus, changedBy, reason, date, time) — inmutable, sin endpoints de edición/borrado.
2. `TicketHistoryRepository`.
3. `TicketHistoryService`: registrar entrada automáticamente dentro de la transacción de cambio de estado en `TicketService`.
4. Regla de transición de estados: `abierto → en progreso → resuelto → cerrado`; exigir `reason` obligatorio al pasar a `resuelto` o `cerrado`.
5. `GET /tickets/:id/history` (solo lectura, ordenado cronológicamente).

**Pruebas unitarias:** `TicketHistoryService` (registro automático en cada transición válida, rechazo de transición inválida, exigencia de `reason` en resuelto/cerrado); endpoint de consulta (orden cronológico, filtrado por ticket).

### Frontend
1. `api/ticketHistoryApi.ts`.
2. `components/TicketHistoryModal` — tabla con fecha, hora, usuario, estado anterior/nuevo.
3. Integración en el detalle del ticket (botón "ver historial").

**Pruebas unitarias:** `TicketHistoryModal` (render de tabla, estado vacío, orden cronológico).

---

## Fase 4 — Consulta, filtros y paginación (HU-04, HU-09, HU-10)

Depende de Fase 2 (necesita tickets existentes) y puede desarrollarse en paralelo a la Fase 3.

### Backend
1. `GET /tickets` con query params: `id`, `title`, `priority`, `status`, `assignedTo`, `date`, `changedBy`, `isModified`, `page`, `pageSize`.
2. `TicketService.findAll` — construcción dinámica de filtros vía TypeORM query builder (parametrizado, sin concatenación de strings).
3. Paginación server-side (`pageSize` por defecto 10, configurable, máximos razonables para evitar abuso 🔒).
4. DTO `TicketQueryDto` para validar y tipar los query params.

**Pruebas unitarias:** `TicketService.findAll` (combinaciones de filtros, paginación, filtros vacíos, límites de `pageSize`); `TicketQueryDto`.

### Frontend
1. `components/TicketFilters` — formulario de filtros combinables + botón "limpiar filtros".
2. `hooks/useTicketFilters` — sincroniza filtros con query string / estado.
3. `components/Pagination` — control de página actual, tamaño de página personalizable.
4. `pages/TicketListPage` — integra filtros + paginación + tabla, actualización automática al cambiar cualquiera.
5. Optimización de renderizado (memoización de filas, `React.memo`/`useMemo` donde aplique, dado el criterio de rendimiento de la historia original).

**Pruebas unitarias:** `useTicketFilters` (actualización de estado, limpieza de filtros); `Pagination` (cambio de página, límites); `TicketListPage` (integración filtros + paginación con datos mockeados).

---

## Fase 5 — Reportes y resumen estadístico (HU-11, HU-12)

Depende de Fase 2 y 3 (agrega sobre tickets y su historial).

### Backend
1. `GET /tickets/summary/status` — conteo agrupado por estado.
2. `GET /tickets/summary/priority` — conteo agrupado por prioridad.
3. `ReportService` con consultas agregadas (`GROUP BY`) vía TypeORM, evitando cálculos en memoria innecesarios.

**Pruebas unitarias:** `ReportService` (conteos correctos por estado/prioridad, dataset vacío, datos mixtos).

### Frontend
1. `api/reportApi.ts`.
2. `pages/DashboardPage` con gráficas (librería a elegir, ej. `recharts`) filtrables por estado/prioridad.
3. `components/SummaryTable` — tabla priorizada agrupando estado y prioridad.

**Pruebas unitarias:** `SummaryTable` (agrupación y orden); transformación de datos para gráficas (`reportService`/utils).

---

## Fase 6 — Endurecimiento de seguridad transversal 🔒

Aplica sobre todo lo anterior; se ejecuta como pase final antes de la auditoría, aunque algunos puntos ya se implementan en su fase correspondiente (marcados arriba).

- Revisar cabeceras de seguridad (`helmet`), CORS restringido a orígenes conocidos.
- Rate limiting en endpoints de autenticación.
- Validación exhaustiva de entrada (DTOs + `class-validator`) en todos los endpoints, no solo los "felices".
- Confirmar que TypeORM use siempre queries parametrizadas (sin `query()` con strings interpolados) — previene inyección SQL.
- Revisar manejo de JWT: expiración, secreto fuerte, no exponer en logs, `httpOnly` si es cookie.
- Revisar almacenamiento en frontend: cifrado si es `localStorage`, sin tokens en la URL ni en `console`.
- `npm audit` (backend y frontend) y actualización de dependencias vulnerables.
- Escapado/verificación de salida en el frontend para prevenir XSS (React ya escapa por defecto; validar que no se use `dangerouslySetInnerHTML`).
- Revisar mensajes de error para no filtrar información sensible (stack traces, rutas internas) en producción.

**Pruebas unitarias:** casos negativos de los middlewares de seguridad (rate limit excedido, token inválido/expirado, rol no autorizado).

---

## Fase 7 — Auditoría final del código

Última etapa, una vez todas las historias están implementadas y probadas.

1. Revisión estática: `eslint` (frontend y backend) sin advertencias pendientes.
2. Verificación de cobertura Jest ≥ 80% por archivo en ambos proyectos.
3. Revisión manual de adherencia a las reglas de `CLAUDE.md` (sin `any`, sin `console.log`, lógica fuera de controllers/componentes, DTOs presentes, Repository Pattern respetado).
4. Auditoría de seguridad OWASP Top 10 sobre endpoints críticos (auth, tickets).
5. Revisión de consistencia de la API contra `docs/openapi.yaml`.
6. Verificación de rendimiento de la lista de tickets con filtros/paginación bajo volumen de datos simulado.
7. Documentación final: actualizar `README` de backend y frontend con instrucciones de instalación, variables de entorno y scripts.

---

## Resumen de dependencias

```
Fase 0 (infra)
   └─▶ Fase 1 (auth)
          └─▶ Fase 2 (CRUD tickets)
                 ├─▶ Fase 3 (historial)
                 ├─▶ Fase 4 (filtros/paginación)
                 └─▶ Fase 5 (reportes, depende también de Fase 3)
                        └─▶ Fase 6 (seguridad transversal)
                               └─▶ Fase 7 (auditoría final)
```
