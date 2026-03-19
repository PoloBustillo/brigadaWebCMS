# Manual de Usuario: Creacion y Validacion de Usuario

## 1. Objetivo
Este manual describe el proceso completo para:

1. Crear un usuario nuevo desde el panel administrativo.
2. Generar y gestionar su codigo de activacion.
3. Validar al usuario cuando activa su cuenta en la app movil.
4. Confirmar que el usuario quedo activo correctamente.

## 2. Alcance
Aplica a estos perfiles:

1. Administrador o Encargado que invita usuarios desde el panel web.
2. Usuario final (brigadista, encargado o admin) que activa su cuenta en la app movil.

## 3. Requisitos Previos
Antes de iniciar, confirma lo siguiente:

1. Tu sesion en el panel web esta iniciada y con permisos para gestionar usuarios.
2. Tienes los datos del usuario: nombre, apellido, correo y rol.
3. El usuario tiene acceso a la app movil Brigada.
4. El usuario tendra conexion a internet durante la activacion.

## 4. Flujo General
El proceso recomendado es:

1. Crear invitacion de usuario en el panel web.
2. Generar codigo de activacion (vence en 72 horas por defecto).
3. Compartir codigo por email (automatico) o canal seguro.
4. Usuario valida codigo en la app movil.
5. Usuario crea contrasena y completa activacion.
6. Administrador verifica estado activado en el panel.

## 5. Paso a Paso: Crear Usuario (Panel Web)

### 5.1 Ingresar a Usuarios
1. Entra al panel web.
2. Abre la seccion Usuarios.
3. Haz clic en Invitar usuario.

### 5.2 Capturar datos
Completa el formulario con:

1. Nombre.
2. Apellido.
3. Email.
4. Telefono (opcional).
5. Rol: admin, encargado o brigadista.
6. Notas (opcional).

### 5.3 Registrar e invitar
1. Presiona Registrar usuario.
2. El sistema realiza dos acciones internas:
   - Crea la entrada en whitelist.
   - Genera codigo de activacion con vigencia de 72 horas.
3. El sistema intenta enviar email automaticamente al usuario.
4. El codigo tambien se muestra en pantalla una sola vez.

### 5.4 Resguardo del codigo
Si necesitas compartirlo manualmente:

1. Copia el codigo en ese momento.
2. Envia por canal seguro.
3. Evita reenviar por canales publicos o grupales.

## 6. Paso a Paso: Gestion de Invitaciones y Codigos
Desde la seccion Whitelist puedes:

1. Buscar invitaciones por nombre o identificador.
2. Filtrar por estado: pendientes o activados.
3. Generar codigo para una invitacion sin codigo activo.
4. Extender un codigo activo (por ejemplo, +24 horas).
5. Reenviar email con codigo.
6. Eliminar invitacion (solo si no se ha activado).

Recomendacion operativa:

1. Si el codigo expiro y el usuario no activo, extender o generar uno nuevo.
2. Si sospechas compromiso del codigo, revocarlo y generar otro.

## 7. Paso a Paso: Validacion del Usuario (App Movil)

### 7.1 Ingreso de codigo
1. Usuario abre la app Brigada.
2. Desde bienvenida selecciona Activar cuenta.
3. Ingresa el codigo de 6 digitos.

### 7.2 Validacion del codigo
La app valida contra backend:

1. Que el codigo exista.
2. Que no este usado.
3. Que no este expirado.
4. Que no este bloqueado.

Si es valido, pasa a crear contrasena.

### 7.3 Creacion de contrasena
El usuario captura:

1. Email (identificador).
2. Contrasena.
3. Confirmacion de contrasena.

Reglas minimas recomendadas por la app:

1. Minimo 8 caracteres.
2. Al menos una mayuscula.
3. Al menos una minuscula.
4. Al menos un numero.

### 7.4 Activacion final
Al confirmar:

1. Se completa activacion en backend.
2. Se crea o habilita la cuenta del usuario.
3. Se marca el codigo como usado.
4. Se marca la entrada de whitelist como activada.
5. El usuario puede iniciar sesion y acceder segun su rol.

## 8. Validacion Administrativa Posterior
Para confirmar que el proceso termino correctamente:

1. Abre Whitelist y verifica estado Activado.
2. Revisa que la invitacion tenga registro de activacion.
3. En Usuarios, confirma que el usuario aparezca y este activo.

## 9. Errores Frecuentes y Solucion

### 9.1 Codigo invalido
Causa probable:

1. Error de captura.
2. Codigo inexistente.

Accion:

1. Confirmar codigo exacto.
2. Regenerar codigo desde Whitelist si es necesario.

### 9.2 Codigo expirado
Causa probable:

1. Se supero la vigencia (72 horas).

Accion:

1. Extender codigo activo o generar uno nuevo.
2. Reenviar email al usuario.

### 9.3 Codigo ya usado
Causa probable:

1. El usuario ya completo activacion.
2. El codigo fue usado por error.

Accion:

1. Verificar si la cuenta ya esta activa.
2. Si no esta activa, generar nuevo codigo.

### 9.4 Sin conexion en app movil
Causa probable:

1. Usuario sin internet durante validacion.

Accion:

1. Solicitar conexion estable (wifi o datos).
2. Reintentar activacion.

### 9.5 No llego email de activacion
Causa probable:

1. Filtro de spam o retraso de proveedor.

Accion:

1. Revisar spam/no deseado.
2. Usar opcion Reenviar email.
3. Compartir codigo manual por canal seguro si es urgente.

## 10. Buenas Practicas de Seguridad

1. Nunca publicar codigos de activacion en chats grupales.
2. Compartir codigos solo con el usuario objetivo.
3. Revocar o regenerar codigo ante cualquier sospecha.
4. Mantener minimo privilegio al asignar roles.
5. Registrar notas claras en invitaciones para trazabilidad.

## 11. Checklist Rapido Operativo

1. Crear invitacion con datos correctos.
2. Verificar que se genero codigo.
3. Confirmar envio de email o compartir codigo seguro.
4. Acompanar al usuario en activacion si lo requiere.
5. Confirmar estado Activado en Whitelist.
6. Confirmar usuario Activo en listado de Usuarios.

## 12. Usuarios y Credenciales de Prueba

Usar solo en ambientes de desarrollo, QA o demo. No usar en produccion.

### 12.1 Usuarios activos para login

1. Admin
   - Email: admin@brigada.com
   - Contrasena: admin123
   - Rol esperado: ADMIN
   - Estado esperado: ACTIVE

2. Encargado
   - Email: encargado@brigada.com
   - Contrasena: encargado123
   - Rol esperado: ENCARGADO
   - Estado esperado: ACTIVE

3. Brigadista
   - Email: brigadista@brigada.com
   - Contrasena: brigadista123
   - Rol esperado: BRIGADISTA
   - Estado esperado: ACTIVE

### 12.2 Usuario para flujo de primera activacion

1. Usuario invitado
   - Email: test@brigada.com
   - Contrasena inicial: cualquier valor de prueba
   - Rol esperado: BRIGADISTA
   - Estado esperado: INVITED

### 12.3 Codigo de activacion de prueba

1. Codigo valido de prueba: 123456

### 12.4 Whitelist de prueba esperada

1. admin@brigada.com
2. encargado@brigada.com
3. brigadista@brigada.com
4. test@brigada.com

Si se usa un email fuera de esta lista en entorno mock, el sistema debe rechazar acceso.

---

Documento recomendado para capacitacion de soporte, operaciones y administradores del sistema.
