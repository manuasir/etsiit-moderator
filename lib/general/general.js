const Palabra          = require('../../models/palabras');
const User             = require('../../models/user');
const preguntas        = require('../../util/preguntas');
const getRandom        = require('../../util/get-random');
const palabrasObject   = require('../../util/palabras');

module.exports = function(bot){


  bot.on('text', async (msg) => {
    try {
      let username = msg.from.username || msg.from.first_name;
      let u = await User.findOne({username: username});
      if (!u) {
        u = new User({username: username, userId: msg.from.id});
        await u.save();
        //msg.reply.text('Usuario @' + msg.from.username + ' almacenado en base de datos, encantado.');
      }
      let palabras = msg.text.split(' ');
      for (let palabra of palabras) {
        if (!(palabra.includes('/')) && palabra.length >= 3 &&
          !['con','mas','eso','esto',
            'del','las','los','por','para',
            'que', 'qué', 'cómo', 'donde',
            'cuando', 'cuándo','hay','este'].includes(palabra)) {
          let tmpP = await Palabra.findOne({palabra: palabra});
          if (tmpP) {
            tmpP.amount++;
          } else {
            tmpP = new Palabra({palabra: palabra});
          }
          await tmpP.save();
        }
      }
      for (let palabra of palabras) {
        if (palabrasObject.prohibidas.includes(palabra.toLowerCase())) {
          msg.reply.text('Se tendrá en cuenta esa forma de hablar');
          return 0;
        }
      }
      return 0;
    } catch (err) {
      throw err;
    }
  });

  bot.on(['/start', '/hello'], (msg) => {
    msg.reply.text('Hola!');
  });

  bot.on(['newChatMembers'], async (msg) => {
    try {
      let username = msg.new_chat_member.username || msg.new_chat_member.first_name;
      if (username === 'etsiit_moderator_bot') {
        return 0;
      }
      let user = new User({
        username: username,
        userId  : msg.new_chat_member.id
      });
      await user.save();
      msg.reply.text('Ha entrado un nuevo miembro');
      let array = getRandom(preguntas, 3);
      msg.reply.text(array[0] + '\n' + array[1] + '\n' + array[2]);
    } catch (err) {
      if (err.code === 11000) {
        let u     = await User.findOne({username:username});
        u.advices = 0;
        await u.save();
        msg.reply.text('Ha entrado un viejo miembro de nuevo');
      } else {
        throw err;
      }
    }
  });

  bot.on(['/aviso'], async (msg) => {
    try {

      let admins         = await bot.getChatAdministrators(msg.chat.id);
      let adminUsernames = [];
      for (let admin of admins.result) {
        adminUsernames.push(admin.user.username);
      }
      if (!adminUsernames.includes(msg.from.username)) {
        msg.reply.text('No eres administrador');
        return 0;
      }
      let user = msg.text.split(' ')[1];
      if (typeof user === 'undefined') {
        msg.reply.text('Necesito un usuario');
        return 0;
      }
      if (user.includes('@')) user = user.split('@')[1];
      let u = await User.findOne({username: user});
      if (u) {
        user = u;
        user.advices++;
        await user.save();
        if (user.advices >= 3) {
          await bot.kickChatMember(msg.chat.id, user.userId);
          msg.reply.text(user.username + ' ha sido expulsado');
          bot.sendVideo(msg.chat.id, 'https://media.giphy.com/media/jkKcgtQcrAvks/giphy.gif');
        } else {
          msg.reply.text(user.username + ' tiene ' + user.advices + ' avisos');
        }
      } else {
        msg.reply.text('Usuario @' + user + ' no encontrado o bien nunca ha hablado');
      }
    } catch (err) {
      throw err;
    }
  });

};