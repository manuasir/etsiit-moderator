# ETSIIT-MODERATOR

[![https://travis-ci.org/jesusgn90/etsiit-moderator.svg?branch=master](https://travis-ci.org/jesusgn90/etsiit-moderator.svg?branch=master)](
https://travis-ci.org/jesusgn90/etsiit-moderator)

- Bot que usa Node.js y sirve para moderar el grupo de la ETSIIT de la UGR en Telegram.
- Realmente se puede usar para moderar cualquier grupo.

# Comandos

- `/start`, `/hello`
  - Devuelve el mensaje 'Hola!'
- `/aviso @username`
  - Incrementa en 1 el número de avisos de un miembro.
    - Si el número de avisos >= 3 lo expulsa del grupo.
    - Se envía un gif de fuego.
  - Si el username no existe dice 'Usuario no encontrado'.
  - El username puede ser en formato @username o username sin @.

# Eventos

- `newChatMember`
  - Se lanza cuando entra un nuevo miembro.
    - Si el bot no lo tenía almacenado en base de datos, lo crea.
    - Si el bot lo tenía almacenado en base de datos, reinicia su contador de avisos a 0.
    - Se emiten 3 preguntas aleatorias de las almacenadas.

# Desarrolladores
- Se require crear un fichero llamado `config.js` con el siguiente contenido:

```js
module.exports = {
  TOKEN: 'tutokenaqui'
};
```

- `npm install`
- `npm start`

# Entorno

- Node.js >= 8.0.0
- Mongodb

# Test
- `npm test`

# Estilo de código
- Usar siempre los estándares ES6/ES7
- Usar async/await en sustitución de las promises habituales.

# Contribuciones
- Abrir una issue.
- Realizar un fork y luego un pull request.

# Autor
- Jesús Ángel González Novez ([@jesusgn90](https://github.com/jesusgn90))