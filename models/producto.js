
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoSchema = new Schema({
    producto: String,
    precio: Number,
    foto: String
})

const Producto = mongoose.model('Producto', ProductoSchema);

module.exports = Producto;