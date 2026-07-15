---
name: document-api
description: Documenta o actualiza endpoints backend en docs/openapi.yaml siguiendo el estándar OpenAPI 3.0, incluyendo parameters, requestBody, responses y schemas reutilizables en components. Usar cuando el usuario pida "documenta este endpoint", "actualiza el swagger/openapi" o después de crear/modificar una ruta en backend/src/routes.
---

# Documentar endpoints en OpenAPI 3.0

## Objetivo

Mantener `docs/openapi.yaml` como fuente de verdad del contrato de API, sincronizada con lo implementado en `backend/src/routes` y `backend/src/controllers`, en formato OpenAPI 3.0 válido.

## Regla de oro

**Un endpoint documentado sin los cuatro elementos siguientes no está completo:**

1. **Parámetros** (`parameters`): todo path param y query param, con `name`, `in`, `required`, `schema` y `description`. Los query params repetidos entre endpoints (filtros, paginación) van en `components/parameters` y se referencian con `$ref`.
2. **Request body** (`requestBody`): para `POST`/`PATCH`/`PUT`, un DTO en `components/schemas` referenciado, con `required` a nivel de propiedad y un `example` realista.
3. **Responses**: al menos el caso de éxito (`200`/`201`/`204`) y los errores relevantes al endpoint (`400` validación, `401` no autenticado, `403` no autorizado, `404` no encontrado, `409` conflicto, `429` rate limit). Cada response con contenido debe apuntar a un schema, no a un objeto inline suelto.
4. **Schemas** (`components/schemas`): entidades y DTOs definidos una sola vez y reutilizados vía `$ref` — nunca dupliques la forma de un objeto en dos endpoints distintos.

## Pasos

1. Leer el controller/ruta correspondiente en `backend/src/` para confirmar: método HTTP, path real, middlewares aplicados (¿requiere `authenticate`? ¿`authorize(role)`?), forma exacta del DTO de entrada y de la respuesta.
2. Revisar si ya existe un schema equivalente en `components/schemas` de `docs/openapi.yaml` antes de crear uno nuevo (evitar duplicación).
3. Añadir/actualizar el path bajo `paths:`, agrupado con el `tag` correspondiente a su épica (Auth, Tickets, Ticket History, Reports, u otra si se agrega una nueva).
4. Si el endpoint requiere autenticación, no declares `security` a nivel de operación — ya se hereda de `security: [bearerAuth]` global; solo sobreescribe con `security: []` en endpoints públicos (ej. `/auth/login`, `/auth/register`).
5. Usar los enums reales del dominio (`TicketPriority`, `TicketStatus`, `UserRole`) vía `$ref`, nunca strings libres cuando el campo es un enum.
6. Mantener la forma de respuesta uniforme del proyecto (`{ success, data, error }`) usando los envelopes existentes (`*Envelope` en `components/schemas`) — si el endpoint es nuevo y no encaja en un envelope existente, crear uno siguiendo el mismo patrón.
7. Añadir al menos un `example` por request body y por response de éxito.
8. Validar la sintaxis del YAML antes de terminar:
   ```
   npx --yes js-yaml docs/openapi.yaml > /dev/null
   ```
   Si falla, corregir el YAML — no dejar el archivo con sintaxis inválida.

## Qué NO hacer

- No documentar un endpoint con un solo `200` genérico sin los errores que realmente puede devolver el controller.
- No usar `type: object` sin `properties` para algo que sí tiene una forma conocida.
- No inventar campos o endpoints que no existan en el código — si documentas antes de implementar (contrato primero), dejarlo explícito en la conversación con el usuario.
- No romper `$ref` existentes al renombrar un schema — si renombras, actualiza todas las referencias.
