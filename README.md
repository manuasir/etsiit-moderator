# ETSIIT-MODERATOR

[![https://travis-ci.org/jesusgn90/etsiit-moderator.svg?branch=master](https://travis-ci.org/jesusgn90/etsiit-moderator.svg?branch=master)](
https://travis-ci.org/jesusgn90/etsiit-moderator)

- Bot que usa Node.js y sirve para moderar el grupo de la ETSIIT de la UGR en Telegram.
- Realmente se puede usar para moderar cualquier grupo.

## TO-DO `(IMPORTANTE)`

- Implementar todos los test unitarios usando MOCHA & CHAI
- Redactar el CONTRIBUTING.md

## Eventos 

- `newChatMember`
- `text`

## Comandos

- `/ranking` 
- `/aviso`
- `/comedores`
- `/perdona <usuario>`
- `/badguys`
- `/horario <servicio>`
- `/normativa`
- `/examenes`
- `/delegacion`
- `/horarios`

## Desarrolladores
- Se requiere crear un fichero llamado `config.js` con el siguiente contenido:

```js
module.exports = {
  TOKEN: 'tutokenaqui'
};
```

- `npm install`
- `npm start`

## Entorno

- Node.js >= 8.0.0
- Mongodb

## Test
- `npm test`

## Estilo de código
- Usar siempre los estándares ES6/ES7
- Usar async/await en sustitución de las promises habituales.

## Contribuciones
- Abrir una issue.
- Realizar un fork y luego un pull request.

## Autor
- Jesús Ángel González Novez ([@jesusgn90](https://github.com/jesusgn90))

## Colaboraciones
  - Añadidas sobre 1000 preguntas para los nuevos miembros [@erseco](https://github.com/erseco)
  - Añadidos comandos sobre horarios y links de la ETSIIT [@ado07](https://github.com/ado07)
  - Patrón facade, refactor [@manuasir](https://github.com/manuasir)
