import express, { Application } from 'express';
const app: Application = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server)
import { Router } from 'express'

import path from 'path'
import * as fs from "fs"

app.use(express.static('public'))
//servidor
app.set('port', 8080)
server.listen(app.get('port'));
console.log(`Server on port ${app.get('port')}`);


app.get('/', (req,res)=>{
    console.log("Hola");
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
})

let productos = [
    { titulo: 'Heladera', precio: '10000', foto: 'https://cdn3.iconfinder.com/data/icons/smart-home-set/132/Icon_refrigerator-64.png' },
    { titulo: 'Horno', precio: '5000', foto: 'https://cdn3.iconfinder.com/data/icons/smart-home-set/132/Icon_refrigerator-64.png'}
]

let messages = [
    { email: 'mail@mail.com', fecha: '28/02/2021', text: 'Hola, soy juan'},
    { email: 'test@mail.com', fecha: '28/02/2021', text: 'Hola juan, yo soy Rodrigo'}
]

io.on('connection', (socket: any) => {
    console.log('se contecto el ciente', socket.id)
    //emito los mensajes ya guardados

    const m = fs.readFileSync('./mensajes.txt', 'utf-8')
    const allm = JSON.parse(m)
    console.log(m)

    socket.emit('messages', allm)

    //escucho los mensajes que envian desde el cliente
    socket.on('new-message', (data: any) => {
        //aca deberia guardar la data que recibo en el txt de mensajes
        //fs.appendFileSync('./mensajes.txt', data)
        allm.push(data);
        io.sockets.emit('messages', allm)
    })
  
|   //emito los productos ya guardados
    socket.emit('producto', productos)

})