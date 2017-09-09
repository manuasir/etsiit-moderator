const TeleBot          = require('telebot');
const {TOKEN}          = require('./config');
const mongoose         = require('mongoose');
const User             = require('./models/user');
const preguntas        = require('./util/preguntas');
const getRandom        = require('./util/get-random');
const palabrasObject   = require('./util/palabras');
const urls             = require('./util/urls');
const servicios        = require('./util/servicios');
const Palabra          = require('./models/palabras');

mongoose.connect('mongodb://localhost/etsiit',{useMongoClient:true});
mongoose.Promise = global.Promise;

const bot = new TeleBot(TOKEN);

const checkUser = async (msg) => {
    try{
        let u = await User.findOne({username: msg.from.username});

        if (!u) {
            u = new User({username: msg.from.username, userId: msg.from.id});
            await u.save();
        }

        return 0;
    } catch(err){
        throw err;
    }
};

const updateWords = async (palabras,msg) => {
    try{

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
        return 0;
    }catch(err){
        throw err;
    }
}

bot.on('text', async (msg) => {
    try {
        let palabras = msg.text.split(' ');

        await checkUser(msg);
        await updateWords(palabras,msg);

        for (let palabra of palabras) {
            if (palabrasObject.prohibidas.includes(palabra.toLowerCase())) {
                msg.reply.text('Se tendrá en cuenta esa forma de hablar');
                break;
            }
        }

        return 0;
    } catch (err) {
        throw err;
    }
});

bot.on(['/status'], async (msg) => {
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
        let usuarios = await User.find({advices:{$ne:0}});
        let str = '';
        if(usuarios){
            for(let usuario of usuarios){
                str = str + (usuario.username + ' - ' + username.advices + '\n');
            }
        }
        msg.reply.text(str);
    }catch(err){
        throw err;
    }
});

bot.on(['/badguys'], async (msg) => {
    try {
        let guys = await User.find({$or:[{advices:1},{advices:2}]}).sort('-advices').exec();
        let str = '';
        if (guys.length > 0) {
            for(let guy of guys){
                str += `@${guy.username} - ${guy.advices} \n`;
            }
        } else {
            str = 'Este es un grupo ejemplar';
        }
        msg.reply.text(str);
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
        if (msg.new_chat_member.username === 'etsiit_moderator_bot') {
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
            msg.reply.text('Usuario @' + user + ' no encontrado o bien nunca ha hablado');
        }
    } catch (err) {
        throw err;
    }
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

/*Comando para saber horarios de servicios de la ETSIIT
 Uso : /horario <servicio>
 */
bot.on('/horario', (msg) => {
    let mensaje;
    let servicio = msg.text.split(' ')[1].toLowerCase();
    if (servicio.includes('ayuda')) {
        mensaje = 'Uso : /horario <servicio>\n \n Servicios disponibles:\n';
        for (let key in servicios) {
            mensaje += '  ' + key + '\n';
        }
        mensaje += '  todos' + '\n';
    } else if (servicio.includes('todos')) {
        mensaje = 'Horario de todos servicios disponibles:\n';
        for (let key in servicios) {
            mensaje += servicios[key] + '\n';
        }
    } else if (typeof servicios[servicio] !== 'undefined') {
        mensaje = servicios[servicio];
    } else {
        mensaje = 'Servicio no encontrado. Use /horario ayuda';
    }

    msg.reply.text(mensaje);
    return 0;
});

bot.start();
