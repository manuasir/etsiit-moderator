const Palabra        = require('../../models/palabras');
const User           = require('../../models/user');
const preguntas      = require('../../util/preguntas');
const getRandom      = require('../../util/get-random');
const palabrasObject = require('../../util/palabras');
const mono           = require('../../util/mono');
const ssus           = require('ssus');
const zelopec        = 13317539;
const {GROUP_ID}     = require('../../config');
/**
 * Divide un mensaje en palabras y las analiza.
 * @param {*} msg 
 */
const checkWord = async msg => {
    if(msg.chat.id !== GROUP_ID) return;
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
        console.error(err);
        return;
    }
}

/**
 * Función lanzada cada vez que alguien manda un mensaje al grupo.
 * @param {*} msg 
 * @param {*} bot 
 */
const texto = async (msg,bot) => {
    if(msg.chat.id !== GROUP_ID) return;
    try {
        if(msg.text.includes('/')) return;
        let username = msg.from.username || msg.from.first_name;
        let u        = await User.findOne({ userId: msg.from.id });
        if (!u) {
            u = new User({ username: username, userId: msg.from.id });
            await u.save();
        }
        await checkWord(msg);
        let palabras = msg.text.split(' ');
        for (let palabra of palabras) {
            if (palabrasObject.freak.includes(palabra.toLowerCase())) {
                await msg.reply.text(getRandom(palabrasObject.freakResponses,1)[0]);
                return;
            }
            if (palabrasObject.oscuridad.includes(palabra.toLowerCase())) {
                await msg.reply.text(`❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌\nLa oscuridad se cierne sobre ${palabra}\n❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌`);
                return;
            }
            if(u && parseInt(u.userId) === zelopec){
                await msg.reply.text(`🖕 ${getRandom(palabrasObject.zelopec,1)[0]}`);
                return;
            }

            if (palabrasObject.prohibidas.includes(palabra.toLowerCase())) {
                await msg.reply.text('⚠️ Se tendrá en cuenta esa forma de hablar');
                if (u) {
                    u.advices += 0.10;
                    await u.save();
                    if (u.advices >= 3) {
                        await bot.kickChatMember(msg.chat.id, user.userId);
                        await msg.reply.text(`⛔️ ${user.username} ha sido expulsado`);
                        bot.sendVideo(msg.chat.id, 'https://media.giphy.com/media/jkKcgtQcrAvks/giphy.gif');
                    }
                }
                return 0;
            }
            if(palabrasObject.izquierda.includes(palabra.toLowerCase())){
                await msg.reply.text(`⛔️ Eso son cosas de rojos.`);
                return 0;
            }
            if(palabrasObject.perdon.includes(palabra.toLowerCase())){
                await msg.reply.text(`⛔️ Perdonar es para los débiles o comunistas.`);
                return 0;
            }
        }
        let randAnswer = Math.floor(Math.random() * 5);
        if(randAnswer === 1){
            await msg.reply.text(`${getRandom(palabrasObject.own,1)[0]}`);
        }
        return 0;
    } catch (err) {
        console.error(err);
        return;
    }
};

/**
 * Función lanzada cada vez que entra un nuevo miembro al grupo.
 * @param {*} msg 
 */
const newMember = async msg => {
    if(msg.chat.id !== GROUP_ID) return;
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
        await msg.reply.text('🖕 Ha entrado un nuevo miembro');

        let array = getRandom(preguntas, 3);
        await msg.reply.text(`${array[0]}\n${array[1]}\n${array[2]}`);
        return 0;
    } catch (err) {
        if (err.code === 11000) {
            let u = await User.findOne({ username: username });
            u.advices = 0;
            await u.save();
            await msg.reply.text('😏 Ha entrado un viejo miembro de nuevo');
        } else {
            console.error(err);
            return;
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
    if(msg.chat.id !== GROUP_ID) return;
    try {
        await addCommand(msg.from.id,'/aviso',msg);
        let admins          = await bot.getChatAdministrators(msg.chat.id);
        admins              = admins.result;

        const adminFiltered = admins.filter(e => e.user.username === msg.from.username);

        if (adminFiltered.length === 0) {
            await msg.reply.text('🖕 No eres administrador');
            return 0;
        }

        let user = msg.text.split(' ')[1];

        if (typeof user === 'undefined') {
            await msg.reply.text('😒 Necesito un usuario');
            return 0;
        }

        if (user.includes('@')) user = user.split('@')[1];
        let u = await User.findOne({ username: user });
        if (u) {
            const isAdmin = admins.filter(e => e.user.username === u.username);
            if(isAdmin.length !== 0){
                await msg.reply.text(`😒 ${u.username} is a madafaka admin`);
                return;
            }
            user = u;
            user.advices++;
            await user.save();
            if (user.advices >= 3) {
                await bot.kickChatMember(msg.chat.id, user.userId);
                await msg.reply.text(`😒 ${user.username} ha sido expulsado`);
                bot.sendVideo(msg.chat.id, 'https://media.giphy.com/media/jkKcgtQcrAvks/giphy.gif');
            } else {
                await msg.reply.text(`😏 ${user.username} tiene ${user.advices} avisos`);
            }
        } else {
            await msg.reply.text(`😏 Usuario @${user} no encontrado o bien nunca ha hablado`);
        }
        return 0;
    } catch (err) {
        console.error(err);
        return;
    }
};

/**
 * Función para decrementar avisos de un usuario.
 * Solo admin.
 * @param {*} msg 
 * @param {*} bot 
 */
const perdona = async (msg,bot) => {
    if(msg.chat.id !== GROUP_ID) return;
    try {
        await addCommand(msg.from.id,'/perdona',msg);
        let admins          = await bot.getChatAdministrators(msg.chat.id);
        admins              = admins.result;

        const adminFiltered = admins.filter(e => e.user.username === msg.from.username);

        if (adminFiltered.length === 0) {
            await msg.reply.text('🖕 No eres administrador');
            return 0;
        }

        let user = msg.text.split(' ')[1];

        if (typeof user === 'undefined') {
            await msg.reply.text('🤘 Necesito un usuario');
            return 0;
        }

        if (user.includes('@')) user = user.split('@')[1];
        let u = await User.findOne({ username: user });
        if (u) {
            user = u;
            user.advices = 0;
            await user.save();
            await msg.reply.text(`🤘 La Santa Inquisición condona tus pecados 🤘.\n🤘${user.username} tiene ahora ${user.advices} avisos 🤘`);
        } else {
            await msg.reply.text(`🖕 Usuario @${user} no encontrado o bien nunca ha hablado`);
        }
        return 0;
    } catch (err) {
        console.error(err);
        return;
    }
};


/**
 * Función para ver los usuarios con avisos.
 * Solo admin.
 * @param {*} msg 
 * @param {*} bot 
 */
const badguys = async (msg,bot) => {
    if(msg.chat.id !== GROUP_ID) return;
    try {
        await addCommand(msg.from.id,'/badguys',msg);
        let users = await User.find({});
        users = users.filter(e => e.advices > 0);
        if (users) {
           let strUsers = '';
           for(let u of users){
                strUsers += `- ${u.username} ${u.advices}\n`;
           }          
           await msg.reply.text(strUsers || `🖕 Usuarios perfectos`);
        } else {
            await msg.reply.text(`🖕 Usuarios perfectos`);
        }
        return 0;
    } catch (err) {
        console.error(err);
        return;
    }
};

/**
 * Envía el PDF del menú de la UGR.
 * @param {*} msg 
 * @param {*} bot 
 */
const comedores = async (msg,bot) => {
    if(msg.chat.id !== GROUP_ID) return;
    try{
        await addCommand(msg.from.id,'/comedores',msg);
        await msg.reply.text('📡 Scrapping scu.ugr.es dame un momento...');
        /*bot.sendDocument(msg.chat.id,'http://scu.ugr.es/?theme=pdf',{
            caption:  		'Ahí tienes el menú en PDF',
            fileName: 		'MENU',
	        serverDownload: true
        });*/
        let json = await ssus();
        let day = null;
        switch(new Date().getDay()){
            case 0:
            day = 'domingo';
            break;
            case 1:
            day = 'lunes';
            break;
                        case 2:
            day = 'martes';
            break;
                        case 3:
            day = 'miercoles';
            break;
                        case 4:
            day = 'jueves';
            break;
                        case 5:
            day = 'viernes';
            break;
                        case 6:
            day = 'sabado';
            break;
        }
        let menu = json[day] || '🖕 El comedor hoy está cerrado';
        if(json[day] && json[day][1] === 'CERRADO') menu = '🖕 El comedor hoy está cerrado';
        let cleanedMenu = '📢📢📢📢📢📢📢📢📢📢📢📢\n';
        if(Array.isArray(menu)){
            for(let item of menu){
                if(!item.includes('Pescado') && 
                    !item.includes('Sulfitos') && 
                    !item.includes('Frutos secos') && 
                    !item.includes('Gluten') &&
                    !item.includes('Alérgenos')){
                        cleanedMenu += `${item}\n`;
                }
            }
            cleanedMenu += '📢📢📢📢📢📢📢📢📢📢📢📢';
            await msg.reply.text(cleanedMenu.toString());
        } else {
            await msg.reply.text(menu.toString().replace(',','\n'));
        }
        return 0;
    } catch (err) {
        console.error(err);
        return;
    }
};


const addCommand = async (userId,command,msg) => {
    try{
        let user = await User.findOne({userId:userId});
        if(!user) return;
        if(typeof user.last_commands === 'undefined'){
            user.last_commands = [command];
        } else {
            user.last_commands.push(command);
            let size = user.last_commands.length;
            if(size >= 3){
                if(user.last_commands[size-1] === user.last_commands[size-2] &&
                   user.last_commands[size-2] === user.last_commands[size-3]){
                    await msg.reply.text(`${user.username} eres un cansino, y por lo tanto voy a incrementar tus avisos en 0.1`);
                    user.advices += 0.1;
                }
                
            }
        }
        await user.save();
        return;
    }catch(err){
        console.error(err);
        return;
    }
};

module.exports = bot => {
    bot.on('text', async msg => await texto(msg,bot));
    bot.on(['/start', '/hello'], msg => msg.reply.text('Hola!'));
    bot.on(['newChatMembers'], newMember);
    bot.on(['/aviso'], async msg => await incrementaAvisos(msg,bot));
    bot.on(['/comedores'], async msg => await comedores(msg,bot));
    bot.on(['/perdona'], async msg => await perdona(msg,bot));
    bot.on(['/badguys'], async msg => await badguys(msg,bot));
    bot.on(['/gr'],async msg => {
	    await addCommand(msg.from.id,'/gr',msg);
	    let admins = await bot.getChatAdministrators(msg.chat.id);
	    admins     = admins.result;

	    const adminFiltered = admins.filter(e => e.user.username === msg.from.username);

	    if (adminFiltered.length === 0) {
	        await msg.reply.text('Este comando no te afecta y además no te puedo echar dado que eres admin, pero te odio.\nChingadera madre gonorrea, hijueputa.');
	        return;
	    }
	    await msg.reply.text('Comando /gr te autodestruye');
	    let user = await User.findOne({userId: msg.from.id});
	    if(!user) return;
	    user.advices++;
            await user.save();
            if (user.advices >= 3) {
                await bot.kickChatMember(msg.chat.id, user.userId);
                await msg.reply.text(`😒 ${user.username} ha sido expulsado`);
                await bot.sendVideo(msg.chat.id, 'https://media.giphy.com/media/jkKcgtQcrAvks/giphy.gif');
            } else {
                await msg.reply.text(`😏 ${user.username} por pesado tiene ${user.advices} avisos`);
            }
            return;
    });
};
