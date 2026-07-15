---
name: write-tests
description: Genera pruebas unitarias con Jest para archivos de backend (services, controllers, repositories, middlewares) o frontend (components, hooks, services) de este proyecto, cumpliendo el umbral de cobertura >80% exigido por CLAUDE.md. Usar cuando el usuario pida "escribe tests", "cubre este archivo con pruebas" o tras implementar una historia de usuario.
---

# Escribir pruebas unitarias (Jest)

## Objetivo

Cubrir el archivo objetivo con pruebas unitarias en Jest que superen el 80% de cobertura (líneas, branches y funciones), siguiendo las reglas de `.claude/CLAUDE.md`.

## Pasos

1. **Identificar la capa** del archivo a probar:
   - Backend: `service`, `controller`, `repository`, `middleware`, `dto`.
   - Frontend: `component`, `hook`, `service`, `util`.
2. **Leer el archivo completo** antes de escribir tests — no asumir su comportamiento.
3. **Ubicar el test** junto a la convención del proyecto: backend en `src/test/` (o `*.spec.ts` junto al archivo si ya existe ese patrón); frontend en `src/**/__tests__/` o `*.test.tsx` junto al componente.
4. **Mockear dependencias externas**:
   - Backend: mockear el `Repository` de TypeORM (no golpear MySQL real), mockear `bcrypt`/`jsonwebtoken` cuando el test no evalúe su lógica interna.
   - Frontend: mockear `fetch`/cliente API (`api/`), mockear `react-router-dom` navigation cuando aplique, usar Testing Library (`render`, `screen`, `userEvent`) en vez de probar detalles de implementación.
5. **Casos obligatorios a cubrir** por cada archivo:
   - Camino feliz (input válido → output esperado).
   - Al menos un caso de error/validación (input inválido, entidad no encontrada, permiso denegado).
   - Casos límite relevantes al dominio (ej. paginación en el límite, transición de estado inválida, campo obligatorio faltante).
6. **No usar `any`** en los tests (regla del proyecto aplica también a tests). Tipar mocks explícitamente.
7. **No dejar `console.log`** — si se necesita depurar, quitarlo antes de terminar.
8. Ejecutar la suite y el reporte de cobertura:
   - Backend: `npm test -- --coverage <ruta-del-archivo>`
   - Frontend: `npm test -- --coverage <ruta-del-archivo>`
9. Si la cobertura queda por debajo de 80%, identificar las líneas/branches no cubiertas en el reporte y añadir casos puntuales — no añadir tests redundantes solo para subir el número.

## Qué NO hacer

- No testear detalles de implementación privada; testear comportamiento observable (inputs/outputs, llamadas a dependencias mockeadas).
- No escribir un test "cascarón" que solo llama a la función sin aserciones significativas.
- No mockear el propio archivo bajo prueba.
- No introducir dependencias de test nuevas sin verificar que ya estén en `package.json` (backend: `jest`, `ts-jest`, `supertest` si aplica; frontend: `jest`, `@testing-library/react`, `@testing-library/jest-dom`).
