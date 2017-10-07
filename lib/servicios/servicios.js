
const urls      = require('../../util/urls');
const servicios = require('../../util/servicios');

module.exports = (bot) => {

    /**
     * Comando para saber horarios de servicios de la ETSIIT
     * @param msg
     */
    bot.on('/horario', (msg) => {
      let mensaje;
      let servicio = (!msg.text.split(' ')[1]) ? 'ayuda' : msg.text.split(' ')[1].toLowerCase() ;
      if (servicio === 'ayuda') {
        mensaje = 'Uso : /horario <servicio>\n \n Servicios disponibles:\n';
        for (let key in servicios) {
          mensaje += `  ${key} \n`;
        }
        mensaje += '  todos\n';
      } else if (servicio.includes('todos')) {
        mensaje = 'Horario de todos servicios disponibles:\n';
        for (let key in servicios) {
          mensaje += `${servicios[key]}\n`;
        }
      } else if (typeof servicios[servicio] !== 'undefined') {
        mensaje = servicios[servicio];
      } else {
        mensaje = 'Servicio no encontrado. Use /horario ayuda';
      }

      msg.reply.text(mensaje);
      return 0;
    });

    bot.on('/normativa', (msg) => {
      msg.reply.text(urls.normativa);
      return 0;
    });

    bot.on('/examenes', (msg) => {
        msg.reply.text(urls.examenes);
        return 0;
    });

    bot.on('/delegacion', (msg) => {
        msg.reply.text(urls.delegacion);
        return 0;
    });

    bot.on('/horarios', (msg) => {
        msg.reply.text(urls.horarios);
        return 0;
    });

};