const TeleBot          = require('telebot');
const mongoose         = require('mongoose');
const config           = require('./config');

mongoose.connect('mongodb://localhost/etsiit',{useMongoClient:true});
mongoose.Promise = global.Promise;

const bot = new TeleBot(config.TOKEN);

const init = require('./lib/index')(bot);

bot.start();