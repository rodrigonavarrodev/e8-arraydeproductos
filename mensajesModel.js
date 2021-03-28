const mensajesModel = {};
require("./database");
const Mensaje = require("./models/mensaje");

mensajesModel.getMensajes = async () => {
    let mensajes = await Mensaje.find();
    return mensajes
}


mensajesModel.insertMensajes = async (coment) => { 
    const item = new Mensaje({
        email: coment.email,
        text: coment.text
    });
    let result = await item.save();
    return res.send(result)
}

module.exports = mensajesModel;