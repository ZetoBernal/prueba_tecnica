# Primera historia de usuario
Yo como PO quiero registro e inicio de sesión de usuarios para que los usuarios puedan registrarse e iniciar sesión cada uno en vista diferente para comodidad de usuario

Criterios de aceptación:
- el usuario no puede ser repetido
- el usuario no puede ser la misma contraseña
- la contraseña no puede contener menos de 8 caracteres
- la contraseña tiene que contener almenos 1 caracter especial y almenos 1 numero
- se tiene que tener un boton para poder visualizar la contraseña al inicio de sesión
- se tiene que confirmar la contraseña al registro
- cuando el usuario se autentique se tiene que crear sesión con JWT manejado con cookies o por localstorage cifrado por seguridad

# Segunda historia
Yo como PO quiero un modulo de gestion de tickets donde se realice un CRUD (create, read, update, delete) con historial de cambios de estado (fecha, hora, usuario) tienen que contener lo siguientes campos:
    - id
    - Título
    - Descripción
    - Prioridad: `baja | media | alta | crítica`
    - Estado: `abierto | en progreso | resuelto | cerrado`
    - Asignado a (usuario)
    - Motivo estado resuelto
    - Motivo estado cerrado
    - fecha
    - hora
    - usuario de cambio de estado
    - Descripción por que modificado
    - Modificado si/no

Criterios de aceptación:
- Se debe de poder crear cada uno de los campos correctamente
- se debe de poder leer cada uno de los campos correctamente 1 o muchos
- Se debe de poder actualizar cada uno de los campos correctamente menos el id ya que tiene que ser unico y auto incremental
- Se debe de poder eliminar cada ticket creado por el usuario
- El estado debe de cambiar correctamente de abierto a en progreso, de en progreso a resuelto y posteriormente a cerrado en el cambio de estado de en progreso a resuelto y de resuelto a cerrado se debe de pedir una descripción y el porque el motivo del estado
- Se le debe de poder asignar tickets a usuarios creados y listados
- Al momento de modificar un ticket se tiene que informar el porque la modificación y tambien mostrar en la interfaz (editado) para indicar que fue modificado

# Tercera historia
Yo como PO quiero que en el modulo de gestion de tickets se tenga filtrado y paginación de tickets para que los usuarios puedan identificar mas facil su ticket, evidencien cambios mas facil, cambio de estados, prioridad o busquen algun ticket en especial, adicional se tenga mejora en el rendimiento de renderizado de la interfaz

Criterios de aceptación:
- se tenga varios filtros en los que pueda filtrar: 
    - id
    - Título
    - Prioridad: `baja | media | alta | crítica`
    - Estado: `abierto | en progreso | resuelto | cerrado`
    - Asignado a (usuario)
    - Motivo estado resuelto
    - Motivo estado cerrado
    - fecha
    - hora
    - usuario de cambio de estado
    - Modificado si/no
- se tenga un paginador abajo en la pagina para cambiar de pagina progresivamente o regresivamente 1 a 2 a 3 ... o 4 a 3 a 2....
- tener un maximo de 10 items por pagina, este parametro tambien puede ser personalizable por el usuario
- la paginación funcione de manera correcta y coherente

# Cuarta historia
Yo como PO quiero un modulo de resumen estadistico de tickets por estado y tickets por prioridad, para identificar cuantos tickets son priotirarios o para identificar cuales tickets estan abiertos o en progreso sin ser actualizados, con el fin de dar un soporte adecuado a cada ticket.

Criterios de aceptación:
- se debe tener graficas con filtros para poder identificar cada estado de ticket y cada prioridad
- se debe de tener una tabla priorizando el resumen de grupo de tickets (estado y prioridad)
