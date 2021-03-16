const knex = require ('./db');
const mensajesModel = {};


mensajesModel.getMensajes = async () => {
    try {
        let result = await knex('mensajes').select('*')
        return result
    } catch(err){
        console.log(err);
    } finally {
        knex.destroy()
    }
    
}


mensajesModel.insertMensajes = async (coment) => { 
    try{
        console.log('coment', coment);
        let result = await knex('mensajes').insert(coment)
        return result
    } catch(err) {
        console.log(err);
    } finally {
        knex.destroy()
    }
}

module.exports = mensajesModel;

