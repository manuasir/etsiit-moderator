const Palabra        = require('../../models/palabras');
const User           = require('../../models/user');
const preguntas      = require('../../util/preguntas');
const getRandom      = require('../../util/get-random');
const palabrasObject = require('../../util/palabras');
const mono           = require('../../util/mono');

/**
 * Divide un mensaje en palabras y las analiza.
 * @param {*} msg 
 */
const checkWord = async (msg) => {
    try{
        let palabras = msg.text.split(' ');
        for (let palabra of palabras) {
            if (!(palabra.includes('/')) && palabra.length >= 3 && !mono.includes(palabra)) {
                let tmpP = await Palabra.findOne({ palabra: palabra });
                if (tmpP) {
                    tmpP.amount++;
                } else {
                    tmpP = new Palabra({ palabra: palabra });
                }
                await tmpP.save();
            }
        }
        return 0;
    }catch(err){
        throw err;
    }
}

/**
 * Función lanzada cada vez que alguien manda un mensaje al grupo.
 * @param {*} msg 
 * @param {*} bot 
 */
const texto = async (msg,bot) => {
    try {
        let username = msg.from.username || msg.from.first_name;
        let u        = await User.findOne({ username: username });

        if (!u) {
            u = new User({ username: username, userId: msg.from.id });
            await u.save();
        }
        
        await checkWord(msg);
        let palabras = msg.text.split(' ');
        for (let palabra of palabras) {
            if(u && u.username === 'Zelopec'){
                msg.reply.text(getRandom(palabrasObject.zelopec,1) || 'WoW');
            }
            if(u && u.username === 'Jesusgn90'){
                msg.reply.text(getRandom(palabrasObject.zelopec,1) || 'WoW');
            }
            if (palabrasObject.prohibidas.includes(palabra.toLowerCase())) {
                msg.reply.text('Se tendrá en cuenta esa forma de hablar');
                if (u) {
                    u.advices += 0.10;
                    await u.save();
                    if (u.advices >= 3) {
                        await bot.kickChatMember(msg.chat.id, user.userId);
                        msg.reply.text(`${user.username} ha sido expulsado`);
                        bot.sendVideo(msg.chat.id, 'https://media.giphy.com/media/jkKcgtQcrAvks/giphy.gif');
                    }
                }
                return 0;
            }
            if(palabrasObject.izquierda.includes(palabra.toLowerCase())){
                msg.reply.text(`Eso son cosas de rojos.`);
            }
            if(palabrasObject.perdon.includes(palabra.toLowerCase())){
                msg.reply.text(`Perdonar es para los débiles o comunistas.`);
            }
        }
        return 0;
    } catch (err) {
        throw err;
    }
};

/**
 * Función lanzada cada vez que entra un nuevo miembro al grupo.
 * @param {*} msg 
 */
const newMember = async (msg) => {
    try {
        let username = msg.new_chat_member.username || msg.new_chat_member.first_name;

        if (username === 'etsiit_moderator_bot') {
            return 0;
        }

        let user = new User({
            username: username,
            userId:   msg.new_chat_member.id
        });

        await user.save();
        msg.reply.text('Ha entrado un nuevo miembro');

        let array = getRandom(preguntas, 3);
        msg.reply.text(array[0] + '\n' + array[1] + '\n' + array[2]);
        return 0;
    } catch (err) {
        if (err.code === 11000) {
            let u = await User.findOne({ username: username });
            u.advices = 0;
            await u.save();
            msg.reply.text('Ha entrado un viejo miembro de nuevo');
        } else {
            throw err;
        }
    }
};

/**
 * Función para incrementar avisos de un usuario.
 * Solo admin.
 * @param {*} msg 
 * @param {*} bot 
 */
const incrementaAvisos = async (msg,bot) => {
    try {
        let admins          = await bot.getChatAdministrators(msg.chat.id);
        admins              = admins.result;

        const adminFiltered = admins.filter((e) => e.user.username === msg.from.username);

        if (adminFiltered.length === 0) {
            msg.reply.text('No eres administrador');
            return 0;
        }

        let user = msg.text.split(' ')[1];

        if (typeof user === 'undefined') {
            msg.reply.text('Necesito un usuario');
            return 0;
        }

        if (user.includes('@')) user = user.split('@')[1];
        let u = await User.findOne({ username: user });
        if (u) {
            const isAdmin = admins.filter((e) => e.user.username === u.username);
            if(isAdmin.length !== 0){
                msg.reply.text(`${u.username} is a madafaka admin`);
                return;
            }
            user = u;
            user.advices++;
            await user.save();
            if (user.advices >= 3) {
                await bot.kickChatMember(msg.chat.id, user.userId);
                msg.reply.text(`${user.username} ha sido expulsado`);
                bot.sendVideo(msg.chat.id, 'https://media.giphy.com/media/jkKcgtQcrAvks/giphy.gif');
            } else {
                msg.reply.text(`${user.username} tiene ${user.advices} avisos`);
            }
        } else {
            msg.reply.text(`Usuario @${user} no encontrado o bien nunca ha hablado`);
        }
        return 0;
    } catch (err) {
        throw err;
    }
};

/**
 * Función para decrementar avisos de un usuario.
 * Solo admin.
 * @param {*} msg 
 * @param {*} bot 
 */
const perdona = async (msg,bot) => {
    try {
        let admins          = await bot.getChatAdministrators(msg.chat.id);
        admins              = admins.result;

        const adminFiltered = admins.filter((e) => e.user.username === msg.from.username);

        if (adminFiltered.length === 0) {
            msg.reply.text('No eres administrador');
            return 0;
        }

        let user = msg.text.split(' ')[1];

        if (typeof user === 'undefined') {
            msg.reply.text('Necesito un usuario');
            return 0;
        }

        if (user.includes('@')) user = user.split('@')[1];
        let u = await User.findOne({ username: user });
        if (u) {
            user = u;
            user.advices = 0;
            await user.save();
            msg.reply.text(`La Santa Inquisición condona tus pecados.\n${user.username} tiene ahora ${user.advices} avisos`);
        } else {
            msg.reply.text(`Usuario @${user} no encontrado o bien nunca ha hablado`);
        }
        return 0;
    } catch (err) {
        throw err;
    }
};


/**
 * Función para ver los usuarios con avisos.
 * Solo admin.
 * @param {*} msg 
 * @param {*} bot 
 */
const badguys = async (msg,bot) => {
    try {
        let users = await User.find({});
        users = users.filter((e) => e.advices > 0);
        if (users) {
           let strUsers = '';
           for(let u of users){
                strUsers += `- ${u.username} ${u.advices}\n`;
           }          
           msg.reply.text(strUsers || `Usuarios perfectos`);
        } else {
            msg.reply.text(`Usuarios perfectos`);
        }
        return 0;
    } catch (err) {
        console.error(err.message);
        throw err;
    }
};

/**
 * Envía el PDF del menú de la UGR.
 * @param {*} msg 
 * @param {*} bot 
 */
const comedores = async (msg,bot) => {
    try{
        bot.sendDocument(msg.chat.id,'http://scu.ugr.es/?theme=pdf',{
            caption:  		'Ahí tienes el menú en PDF',
            fileName: 		'MENU',
	        serverDownload: true
        });

        return 0;
    } catch (err) {
    	console.error(err);
        throw err;
    }
};

module.exports = (bot) => {
    bot.on('text', async (msg) => await texto(msg,bot));
    bot.on(['/start', '/hello'], (msg) => msg.reply.text('Hola!'));
    bot.on(['newChatMembers'], newMember);
    bot.on(['/aviso'], async (msg) => await incrementaAvisos(msg,bot));
    bot.on(['/comedores'], async (msg) => await comedores(msg,bot));
    bot.on(['/perdona'], async (msg) => await perdona(msg,bot));
    bot.on(['/badguys'], async (msg) => await badguys(msg,bot));
};
