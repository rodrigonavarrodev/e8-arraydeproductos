"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = express_1.default();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path_1 = __importDefault(require("path"));
var fs = __importStar(require("fs"));
app.use(express_1.default.static('public'));
//servidor
app.set('port', 8080);
server.listen(app.get('port'));
console.log("Server on port " + app.get('port'));
app.get('/', function (req, res) {
    console.log("Hola");
    res.sendFile(path_1.default.join(__dirname, '../public', 'index.html'));
});
var productos = [
    { titulo: 'Heladera', precio: '10000', foto: 'https://cdn3.iconfinder.com/data/icons/smart-home-set/132/Icon_refrigerator-64.png' },
    { titulo: 'Horno', precio: '5000', foto: 'https://cdn3.iconfinder.com/data/icons/smart-home-set/132/Icon_refrigerator-64.png' }
];
var messages = [
    { email: 'mail@mail.com', fecha: '28/02/2021', text: 'Hola, soy juan' },
    { email: 'test@mail.com', fecha: '28/02/2021', text: 'Hola juan, yo soy Rodrigo' }
];
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
    })
        | //emito los productos ya guardados
            socket.emit('producto', productos);
});
