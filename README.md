# ETSIIT-MODERATOR

[![https://travis-ci.org/jesusgn90/etsiit-moderator.svg?branch=master](https://travis-ci.org/jesusgn90/etsiit-moderator.svg?branch=master)](
https://travis-ci.org/jesusgn90/etsiit-moderator)

- Bot que usa Node.js y sirve para moderar el grupo de la ETSIIT de la UGR en Telegram.
- Realmente se puede usar para moderar cualquier grupo.

# Comandos a los que reacciona

- `/start`, `/hello`
- `/aviso @username`
- `/normativa`
- `/ranking`
- `/examenes`
- `/delegacion`
- `/horarios`
- `/horario <servicio>`
- `/badguys`

# Eventos a los que reacciona

- `newChatMember`
- `text`

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

# Colaboraciones
- Ernesto Serrano ([@erseco](https://github.com/erseco))
  - Añadidas sobre 1000 preguntas para los nuevos miembros, gracias.
- [@ado07](https://github.com/ado07)
  - Añadidos comandos sobre horarios y links de la ETSIIT, gracias.
