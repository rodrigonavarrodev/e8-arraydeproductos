const express = require('express')
//const app = express()
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server)
const fs = require('fs');
const knex = require ('./db');
const { getMensajes, insertMensajes } = require("./mensajesModel");



const router = express.Router()
const path = require('path');


app.use(express.json())
app.use(express.urlencoded({extended: true}))


const m = './mensajes.txt'


app.get('/', function (req, res) {
    console.log('ruta principal');
    res.sendFile(path.join(__dirname, '/public', 'index.html'));

})


//app.use('/api', router)
app.use(express.static('public'))


server.listen(8080, () => {
    console.log("El servidor esta corriendo en el puerto 8080");
})

io.on('connection', async (socket) => {
    console.log('se contecto el ciente', socket.id)
    //emito los mensajes ya guardados

    let msgs = await getMensajes();
    console.log('leyendo base', msgs);
    
    socket.emit('messages', msgs)

    //escucho los mensajes que envian desde el cliente
    socket.on('new-message', async (data) => {
        //escucho el mensaje que me mandan desde el formulario y lo guardo en la base de datos
        //console.log(data);
        let result = await insertMensajes(data);
       
        let msgsNuevos = await getMensajes();
        //console.log('base2', msgs);
        io.sockets.emit('messages', msgsNuevos)
    })
})
