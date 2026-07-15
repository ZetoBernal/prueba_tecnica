---
name: review-code
description: Revisa el diff actual o un archivo del proyecto contra las reglas de arquitectura y seguridad de .claude/CLAUDE.md (backend Node/Express/TypeORM y frontend React/TS). Usar cuando el usuario pida "revisa este código", "haz code review" o antes de cerrar una tarea de una fase del work-plan.
---

# Revisión de código

## Objetivo

Verificar que el código cumple simultáneamente: (1) las reglas de `.claude/CLAUDE.md`, (2) corrección funcional frente a la historia de usuario que implementa, y (3) buenas prácticas de seguridad básicas (OWASP).

## Checklist backend

- [ ] Sin `any` en ningún tipo, parámetro o retorno.
- [ ] Toda función async usa `async/await` (no `.then/.catch` mezclado).
- [ ] Los controllers **no contienen lógica de negocio** — solo reciben request, llaman a un `service` y devuelven respuesta JSON.
- [ ] Toda la lógica de negocio vive en `services/`.
- [ ] Acceso a datos pasa por `repositories/` (Repository Pattern), nunca queries sueltas en `services` o `controllers`.
- [ ] Existen DTOs para entrada (`CreateXDto`, `UpdateXDto`, `XQueryDto`) con validación (`class-validator` u equivalente).
- [ ] Nombres de archivos, carpetas, variables y funciones en inglés.
- [ ] Sin `console.log` — usar el logger del proyecto.
- [ ] Todo error está manejado (`try/catch` o middleware de errores central), sin dejar promesas sin capturar.
- [ ] Toda respuesta es JSON con forma consistente.
- [ ] Queries de TypeORM parametrizadas (sin concatenación de strings) — riesgo de inyección SQL.
- [ ] Contraseñas siempre hasheadas (`bcrypt`), nunca devueltas en una respuesta.
- [ ] JWT: secreto desde variable de entorno, expiración configurada, no logueado.
- [ ] Rutas protegidas usan el middleware de autenticación/autorización correspondiente.

## Checklist frontend

- [ ] Sin `any`; tipos/interfaces explícitos para props, estado y respuestas de API.
- [ ] Componentes funcionales con Hooks, responsabilidad única, tamaño acotado.
- [ ] Sin lógica de negocio dentro de componentes — vive en `services/`.
- [ ] Llamadas a la API centralizadas en `api/`, nunca `fetch`/`axios` sueltos en componentes.
- [ ] `async/await` + `try/catch` en toda llamada asíncrona.
- [ ] Sin `console.log`.
- [ ] Nombres en inglés; `camelCase` para variables/funciones, `PascalCase` para componentes/tipos.
- [ ] Sin duplicación — reutiliza componentes/hooks/utils existentes antes de crear nuevos.
- [ ] Estilos separados de la lógica (no estilos inline mezclados con lógica compleja).
- [ ] URLs y configuración vía `.env` (`VITE_*`), nunca hardcodeadas.
- [ ] Validación de datos antes de enviarlos al backend.
- [ ] Tipos/interfaces definidos para toda respuesta de API consumida.
- [ ] Rutas centralizadas en `routes/`.
- [ ] Sin `dangerouslySetInnerHTML` con datos no sanitizados (XSS).
- [ ] Tokens de sesión no se loguean ni se exponen en la URL.

## Proceso

1. Identificar el alcance: diff actual (`git diff`) o archivo(s) señalado(s) por el usuario.
2. Leer el archivo completo, no solo el fragmento cambiado, para juzgar el contexto (ej. si ya existe un service que se está duplicando).
3. Aplicar el checklist correspondiente (backend y/o frontend según el archivo).
4. Contrastar contra la historia de usuario relevante en `docs/user-stories-refined.md` y la fase correspondiente en `docs/work-plan.md` — señalar criterios de aceptación no cubiertos.
5. Reportar hallazgos ordenados por severidad (bug/seguridad primero, luego incumplimiento de reglas, luego estilo/simplificación), citando `archivo:línea`.
6. No aplicar fixes automáticamente salvo que el usuario lo pida explícitamente.
