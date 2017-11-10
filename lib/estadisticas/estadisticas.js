const Palabra = require('../../models/palabras');
const {GROUP_ID} = require('../../config');
/**
 * Obtiene el ranking de palabras más usadas.
 * @param {*} msg 
 */
const ranking = async msg => {
    if(msg.chat.id !== GROUP_ID) return;
    try {
        let palabras = await Palabra.find({}).sort('-amount').exec();
        if (palabras.length >= 3) {
            await msg.reply.text(
              `${palabras[0].palabra} (${palabras[0].amount} veces), ` +
              `${palabras[1].palabra} (${palabras[1].amount} veces), ` +
              `${palabras[2].palabra} (${palabras[2].amount} veces)`
            );
        } else if (palabras.length === 2) {
            await msg.reply.text(
              `${palabras[0].palabra} (${palabras[0].amount} veces), ` +
              `${palabras[1].palabra} (${palabras[1].amount} veces)`
            );
        } else if (palabras.length === 1) {
            await msg.reply.text(
              `${palabras[0].palabra} (${palabras[0].amount} veces)`
            );
        } else {
            await msg.reply.text('Hablen más por favor');
        }
        return 0;
    } catch (err) {
        msg.reply.text(`😔 Lamento decirte que algo fallado...\nPor favor abre una issue en GitHub.`);
    }
};

module.exports = bot => bot.on(['/ranking'], ranking);