
const urls      = require('../../util/urls');
const servicios = require('../../util/servicios');

/**
 * Función para pedir un horario de forma dinámica.
 * @param {*} msg Mensaje que se recibe por parte de un usuario.
 */
const horario = msg => {
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
};

/**
 * Servicios que muestra el bot.
 * @param {*} bot Elemento tipo bot de la librería telebot.
 */
const run = bot => {
    bot.on('/horario', horario);
    bot.on('/normativa', (msg) => msg.reply.text(urls.normativa));
    bot.on('/examenes', (msg) => msg.reply.text(urls.examenes));
    bot.on('/delegacion', (msg) => msg.reply.text(urls.delegacion));
    bot.on('/horarios', (msg) => msg.reply.text(urls.horarios));
};

module.exports = run;