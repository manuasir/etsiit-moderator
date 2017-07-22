const TeleBot  = require('telebot');
const config   = require('./config');
const mongoose = require('mongoose');
mongoose.connect('localhost/etsiit');

const bot        = new TeleBot(config.TOKEN);
const User       = require('./models/user');
const preguntas  = require('./util/preguntas');
const getRandom  = require('./util/get-random');
const prohibidas = require('./util/palabras-prohibidas');
const Palabra    = require('./models/palabras');

bot.on('text', async (msg) => {
    try {
        let u = await User.findOne({username:msg.from.username});
        if(!u){
            u = new User({username: msg.from.username, userId: msg.from.id});
            await u.save();
            msg.reply.text('Usuario @' + msg.from.username + ' almacenado en base de datos, encantado.');
        }
        let palabras = msg.text.split(' ');
        for (let palabra of palabras) {
            let tmpP = await Palabra.findOne({palabra: palabra});
            if (tmpP) {
                tmpP.amount++;
            } else {
                tmpP = new Palabra({palabra: palabra});
            }
            await tmpP.save();
        }
        for (let palabra of palabras) {
            if (prohibidas.includes(palabra.toLowerCase())) {
                msg.reply.text('Ese lenguaje jovenzuelo...');
                return 0;
            }
        }
        return 0;
    } catch (err) {
        throw err;
    }
});

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

bot.on(['/start', '/hello'], (msg) => {
    msg.reply.text('Hola!');
});

bot.on(['newChatMembers'], async (msg) => {
    try {
        if(msg.new_chat_member.username === 'etsiit_moderator_bot'){
            return 0;
        }
        let user = new User({
            username: msg.new_chat_member.username,
            userId  : msg.new_chat_member.id
        });
        await user.save();
        msg.reply.text('Ha entrado un nuevo miembro');
        let array = getRandom(preguntas, 3);
        msg.reply.text(array[0] + '\n' + array[1] + '\n' + array[2]);
    } catch (err) {
        if (err.code === 11000) {
            let u     = await User.findOne({username: msg.new_chat_member.username});
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
            msg.reply.text('Usuario @' + user + ' no encontrado');
        }
    } catch (err) {
        throw err;
    }
});

bot.start();