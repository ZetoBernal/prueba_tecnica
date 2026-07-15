## Épica: Autenticación de usuarios

### HU-01. Registro de usuario

Como **usuario / administrador**, quiero **registrar una cuenta** para **acceder al sistema de gestión de tickets**.

**Criterios de aceptación:**

* El sistema debe solicitar nombre, correo electrónico y contraseña.
* El correo electrónico debe ser único.
* La contraseña debe cumplir con los requisitos mínimos de seguridad.
* Al registrarse correctamente, la cuenta debe quedar disponible para iniciar sesión.
* Si el correo ya existe, el sistema debe mostrar un mensaje de error.
- Se debe de distingir por roles a los usuarios admin/usuario
- se tiene que tener un boton para poder visualizar la contraseña al inicio de sesión
- cuando el usuario se autentique se tiene que crear sesión con JWT manejado con cookies o por localstorage cifrado por seguridad
- se tiene que confirmar la contraseña al registro

`El agente me sugirio cambiar algunos criterios para tener mejor entendimiento y claridad con la tarea añadi algunos que creo que hicieron falta`

### HU-02. Inicio de sesión

Como **usuario registrado**, quiero **iniciar sesión** para **acceder a las funcionalidades del sistema**.

**Criterios de aceptación:**

* El usuario debe ingresar correo y contraseña.
* Si las credenciales son correctas, el sistema debe permitir el acceso.
* Si las credenciales son incorrectas, debe mostrarse un mensaje de error.
* Solo los usuarios autenticados pueden acceder al sistema.

`El agente me sugirio añadir esta historia de usuario por que va separada del registro y tiene sentido son dos historias diferentes no una como la estaba planeando yo`

## Épica: Gestión de tickets

### HU-03. Crear ticket

Como **usuario**, quiero **crear un ticket** para **reportar una incidencia o solicitud**.

**Criterios de aceptación:**

* El ticket debe permitir ingresar:

    - id (requerido, auto incremental)
    - Título (Requerido)
    - Prioridad: `baja | media | alta | crítica` (Requerido)
    - Estado: `abierto | en progreso | resuelto | cerrado` (Requerido)
    - Asignado a (usuario) (Requerido)
    - Motivo estado resuelto 
    - Motivo estado cerrado
    - fecha (Requerido)
    - hora (Requerido)
    - usuario de cambio de estado
    - Modificado si/no (defecto no)

* Todos los campos obligatorios deben validarse.
* El ticket debe almacenarse correctamente en el sistema.
- Se le debe de poder asignar tickets a usuarios creados y listados

`El agente me sugirio añadir esta historia de usuario por que va separada de toda mi segunda historia y tiene sentido son varias historias diferentes no solo 1 que junta todo porque cada una debe de realizar su acción y proposito, adicional añadi ciertos campos`


### HU-04. Consultar tickets

Como **usuario**, quiero **visualizar la lista de tickets** para **consultar la información registrada**.

**Criterios de aceptación:**

* El sistema debe mostrar todos los tickets disponibles.
* Cada registro debe mostrar título, prioridad, estado y usuario asignado.
* Debe ser posible acceder al detalle de un ticket.
* La información debe estar actualizada.

`El agente me sugirio añadir esta historia de usuario por que va separada de toda mi segunda historia y tiene sentido son varias historias diferentes no solo 1 que junta todo porque cada una debe de realizar su acción y proposito`

### HU-05. Actualizar ticket

Como **usuario**, quiero **editar la información de un ticket** para **mantenerla actualizada**.

**Criterios de aceptación:**

* Debe ser posible modificar:

    * Título.
    * Descripción.
    * Prioridad.
    * Estado.
    * Usuario asignado.
    - Motivo estado resuelto 

* Los cambios deben guardarse correctamente.
* Si cambia el estado, debe registrarse en el historial.
* El sistema debe validar los datos antes de guardar.
- Al momento de modificar un ticket se tiene que informar el porque la modificación y tambien mostrar en la interfaz (editado) para indicar que fue modificado

`El agente me sugirio añadir esta historia de usuario por que va separada de toda mi segunda historia y tiene sentido son varias historias diferentes no solo 1 que junta todo porque cada una debe de realizar su acción y proposito`

### HU-06. Eliminar ticket

Como **usuario**, quiero **eliminar un ticket** para **retirar registros que ya no sean necesarios**.

**Criterios de aceptación:**

* El sistema debe solicitar confirmación antes de eliminar.
* El ticket debe eliminarse permanentemente.
* El ticket eliminado no debe aparecer en las consultas posteriores.
* Si el ticket no existe, el sistema debe informar el error.

`El agente me sugirio añadir esta historia de usuario por que va separada de toda mi segunda historia y tiene sentido son varias historias diferentes no solo 1 que junta todo porque cada una debe de realizar su acción y proposito`

## Épica: Historial de cambios

### HU-07. Registrar historial de cambios de estado

Como **usuario**, quiero **que el sistema registre automáticamente cada cambio de estado de un ticket** para **tener trazabilidad del proceso**.

**Criterios de aceptación:**

* Cada cambio de estado debe registrar:

  * Estado anterior.
  * Estado nuevo.
  * Fecha.
  * Hora.
  * Usuario que realizó el cambio.
* El historial no debe poder modificarse manualmente.
* Todos los cambios deben conservarse.
- Al momento de modificar un ticket se tiene que informar el porque la modificación y tambien mostrar en la interfaz (editado) para indicar que fue modificado
- El estado debe de cambiar correctamente de abierto a en progreso, de en progreso a resuelto y posteriormente a cerrado en el cambio de estado de en progreso a resuelto y de resuelto a cerrado se debe de pedir una descripción y el porque el motivo del estado

`El agente me sugirio añadir esta historia de usuario por que va separada de toda mi segunda historia y tiene sentido son varias historias diferentes no solo 1 que junta todo porque cada una debe de realizar su acción y proposito`

### HU-08. Consultar historial de cambios

Como **usuario**, quiero **consultar el historial de estados de un ticket** para **conocer su evolución**.

**Criterios de aceptación:**

* El historial debe mostrarse en orden cronológico.
* Cada registro debe incluir:

  * Fecha.
  * Hora.
  * Usuario.
  * Estado anterior.
  * Estado nuevo.
- Solo deben visualizarse los cambios correspondientes al ticket seleccionado de preferencia crear un modal con esta información en una tabla.

`El agente me sugirio añadir esta historia de usuario por que va separada de toda mi segunda historia y tiene sentido son varias historias diferentes no solo 1 que junta todo porque cada una debe de realizar su acción y proposito`

## Épica: Consulta de tickets

### HU-09. Filtrar tickets

Como **usuario**, quiero **filtrar los tickets** para **encontrar rápidamente la información que necesito**.

**Criterios de aceptación:**

- se tenga varios filtros en los que pueda filtrar: 
    - id
    - Título
    - Prioridad: `baja | media | alta | crítica`
    - Estado: `abierto | en progreso | resuelto | cerrado`
    - Asignado a (usuario)
    - fecha
    - usuario de cambio de estado
    - Modificado si/no
* Los filtros pueden combinarse.
* Debe existir una opción para limpiar los filtros.
* La lista debe actualizarse automáticamente al aplicar los filtros.

`El agente me sugirio añadir esta historia de usuario por que va separada de toda mi tercera historia y tiene sentido son varias historias diferentes no solo 1 que junta todo porque cada una debe de realizar su acción y proposito, adicional añadi campos que considero que deberian de ir en el filtro`

### HU-10. Paginar tickets

Como **usuario**, quiero **visualizar los tickets mediante paginación** para **consultar grandes volúmenes de información de forma organizada**.

**Criterios de aceptación:**

* La lista debe dividirse en páginas.
* Debe indicarse la página actual.
* El usuario debe poder navegar entre páginas.
* La paginación debe respetar los filtros aplicados.
- tener un maximo de 10 items por pagina, este parametro tambien puede ser personalizable por el usuario

`El agente me sugirio añadir esta historia de usuario por que va separada de toda mi tercera historia y tiene sentido son varias historias diferentes no solo 1 que junta todo porque cada una debe de realizar su acción y proposito, adicional añadi una funcionalidad extra que considero que puede ser buena experiencia de usuario, adicional al renderizar 10 items por pagina se tiene un control visual del usuario`

## Épica: Reportes

### HU-11. Resumen estadístico por estado

Como **usuario**, quiero **visualizar la cantidad de tickets por estado** para **conocer el avance de las incidencias**.

**Criterios de aceptación:**

* El sistema debe mostrar el total de tickets en cada estado:

  * Abierto.
  * En progreso.
  * Resuelto.
  * Cerrado.
* La información debe actualizarse con los datos actuales.
* El resumen debe mostrarse de forma clara.

`El agente me sugirio añadir esta historia de usuario por que va separada de toda mi cuarta historia y tiene sentido son varias historias diferentes`

### HU-12. Resumen estadístico por prioridad

Como **usuario**, quiero **visualizar la cantidad de tickets por prioridad** para **identificar el nivel de criticidad de las incidencias**.

**Criterios de aceptación:**

* El sistema debe mostrar el total de tickets por prioridad:

  * Baja.
  * Media.
  * Alta.
  * Crítica.
* La información debe reflejar el estado actual del sistema.
* Los datos deben calcularse automáticamente al consultar el resumen.
- se debe tener graficas con filtros para poder identificar cada estado de ticket y cada prioridad
- se debe de tener una tabla priorizando el resumen de grupo de tickets (estado y prioridad)

`El agente me sugirio añadir esta historia de usuario por que va separada de toda mi cuarta historia y tiene sentido son varias historias diferentes`