const express = require('express')
//const app = express()
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server)

const router = express.Router()
const path = require('path');
const handlebars = require('express-handlebars')


app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials/'
    })
)


let productos = []

app.get('/', function (req, res) {
    //res.sendFile(path.join(__dirname, '/public', 'index.html'));
    res.render('form')
})



app.get('/productos', (req, res) => {
    if (productos.length === 0) {
    res.render('productos', {productos: [
        {titulo: "No hay productos para mostrar"}
    ], listExists: true})
    }
    res.render('productos', {productos, listExists: true})
})
 
app.get('/productos/:id', (req, res) => {
    const id = req.params.id
    const producto = productos.find( producto => producto.id == id)
    if(!producto) {
        res.status(404).json("El producto no existe")
        
    }
    res.render('productos', {productos, listExists: true})
})

app.post('/productos', (req, res) => {
    const { titulo, precio, foto} = req.body
    const producto = {
        titulo,
        precio,
        foto,
        id: productos.length+1
    }
    productos.push(producto)
    //res.send([...productos, producto])
    res.render('productos', {productos, listExists: true})
})

app.put('/productos/:id', (req, res) => {
    const id = req.params.id
    const producto = productos.find( producto => producto.id == id)
    if(!producto) {
        res.status(404).json("El producto no existe")
    }
    const { titulo, precio, foto} = req.body
    producto.titulo = titulo
    producto.precio = precio
    producto.foto = foto
    res.render('productos', {productos, listExists: true})
}) 

app.delete('/productos/:id', (req, res) => {
    const id = req.params.id
    const producto = productos.find( producto => producto.id == id)
    if(!producto) {
        res.status(404).json("El producto no existe")
    }
    productos = productos.filter( producto => producto.id === id)
    res.render('productos', {productos, listExists: true})
})


//app.use('/api', router)

app.set('view engine', 'hbs')
app.set('views', './views')
app.use(express.static('public'))


server.listen(8080, () => {
    console.log("El servidor esta corriendo en el puerto 8080");
})

//escuchamos un evento de conexion
/* io.on('connection', (socket) => {
    console.log(socket.id);

    socket.broadcast.emit('productos', {productos});

    socket.on('product', (message) => {
        const { titulo, precio, foto} = message;

        const producto = {
            titulo,
            precio,
            foto,
            id: productos.length+1
        }

        products.push(producto);
    })  
}) */


io.on('connection', (socket) => {
    socket.broadcast.emit('productos', 'Desde el server')
    //console.log(socket.id)
    socket.on('producto', (mensaje) => {
        console.log(mensaje);
        io.emit('producto', mensaje)
    })
})
