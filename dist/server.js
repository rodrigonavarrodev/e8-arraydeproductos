'use strict';

var express = require('express');
//const app = express()
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');

var router = express.Router();
var path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var m = './mensajes.txt';

var productos = [{ titulo: 'Heladera', precio: '10000', foto: 'https://cdn3.iconfinder.com/data/icons/smart-home-set/132/Icon_refrigerator-64.png' }, { titulo: 'Horno', precio: '5000', foto: 'https://cdn3.iconfinder.com/data/icons/smart-home-set/132/Icon_refrigerator-64.png' }];

var messages = [{ email: 'mail@mail.com', fecha: '28/02/2021', text: 'Hola, soy juan' }, { email: 'test@mail.com', fecha: '28/02/2021', text: 'Hola juan, yo soy Rodrigo' }];

app.get('/', function (req, res) {
    console.log('ruta principal');
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

//app.use('/api', router)
app.use(express.static('public'));

server.listen(8080, function () {
    console.log("El servidor esta corriendo en el puerto 8080");
});

io.on('connection', function (socket) {
    console.log('se contecto el ciente', socket.id);
    //emito los mensajes ya guardados

    var m = fs.readFileSync('./mensajes.txt', 'utf-8');
    var allm = JSON.parse(m);
    console.log(m);

    socket.emit('messages', allm);

    //escucho los mensajes que envian desde el cliente
    socket.on('new-message', function (data) {
        //aca deberia guardar la data que recibo en el txt de mensajes
        //fs.appendFileSync('./mensajes.txt', data)
        allm.push(data);
        io.sockets.emit('messages', allm);
    }) | //emito los productos ya guardados
    socket.emit('producto', productos);
});
