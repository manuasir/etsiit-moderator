/**
 * Interfaz de utilidades que usa el bot.
 * @param {*} bot Bot de la librería telebot.
 */
const run = (bot) => {
    require('./estadisticas/estadisticas')(bot);
    require('./general/general')(bot);
    require('./servicios/servicios')(bot);
};
module.exports = run;
