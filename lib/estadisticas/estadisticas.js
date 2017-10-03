const Palabra          = require('../../models/palabras');

module.exports = (bot) => {

  bot.on(['/ranking'], async (msg) => {
    try {
      let palabras = await Palabra.find({}).sort('-amount').exec();
      if (palabras.length >= 3) {
        msg.reply.text(
          palabras[0].palabra +
          ' (' + palabras[0].amount + ' veces), '
          + palabras[1].palabra
          + '(' + palabras[1].amount + ' veces), '
          + palabras[2].palabra
          + '(' + palabras[2].amount + ' veces)'
        );
      } else if (palabras.length === 2) {
        msg.reply.text(
          palabras[0].palabra +
          ' (' + palabras[0].amount + ' veces), ' +
          palabras[1].palabra +
          '(' + palabras[1].amount + ' veces)'
        );
      } else if (palabras.length === 1) {
        msg.reply.text(
          palabras[0].palabra +
          ' (' + palabras[0].amount + ' veces)'
        );
      } else {
        msg.reply.text('Hablen más por favor');
      }
      return 0;
    } catch (err) {
      throw err;
    }
  });


};
