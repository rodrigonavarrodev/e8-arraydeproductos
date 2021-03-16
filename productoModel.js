const knex = require ('./db');
const productModel = {};


productModel.getProducts = async () => {
    try {
        let result = await knex('productos').select('*')
        return result
    } catch(err){
        throw err
    } finally {
        knex.destroy()
    }
    
}

productModel.getProductsByID = async (id) => { 
    try {
        let result = await knex('productos').select('*').where('id', '=', id)
        return result
    } catch(err){
        throw err
    } finally {
        knex.destroy()
    }
    
}

productModel.insertProducts = async (item) => { 
    try{
        let result = await knex('productos').insert(item)
        return result
    } catch(err) {
        throw err
    } finally {
        knex.destroy()
    }
}

module.exports = productModel;

