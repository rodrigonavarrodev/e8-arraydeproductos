const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MensajeSchema = new Schema({
    text: String,
    autor: Object
})

const Mensaje = mongoose.model('Mensaje', MensajeSchema);

module.exports = Mensaje;