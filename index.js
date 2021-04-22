const express = require("express");
const app = express();
const router = express.Router();
const { normalize, schema, denormalize } = require('normalizr')
const Mensaje = require("./mensaje.model");
const util = require('util')

const msj = require('./mensajes.json')
const normalizemsj = require('./normalizemensaje.json');


const autor = new schema.Entity('autor')
const mensajes = new schema.Entity('mensajes', {
    autor: autor
})

require("./database");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function print(obj) {
    console.log(util.inspect(obj,false,12,true));
}

router.get("/json", async function (req, res) {
    //const result = await Mensaje.find();
    //res.json( result );
    console.log(JSON.stringify(msj).length);
    res.json( msj )
});

router.get("/normalizr", async function (req, res) {
    //const result = await Mensaje.find();
    const normalizedData = normalize(msj, [mensajes])
    print(normalizedData)
    console.log(JSON.stringify(normalizedData).length);
    res.json( normalizedData );
});

router.get("/desnormalizr", async function (req, res) {
    const denormalizedData = denormalize(normalizemsj.result, [mensajes], normalizemsj.entities)
    res.json(denormalizedData)
})

app.use("/api", router);
app.listen(5000, () => {
  console.log("El servidor esta corriendo en el puerto 5000");
});
