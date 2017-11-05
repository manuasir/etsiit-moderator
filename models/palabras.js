const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;

const userSchema = new Schema({
    palabra: {
        type    : String,
        required: true,
        unique  : true
    },
    amount  : {
        type   : Number,
        default: 1
    }
});

module.exports = mongoose.model('palabras', userSchema);
