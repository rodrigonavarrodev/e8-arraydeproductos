const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MensajeSchema = new Schema({
    email: String,
    text: String,
})

const Mensaje = mongoose.model('Mensaje', MensajeSchema);

module.exports = Mensaje;