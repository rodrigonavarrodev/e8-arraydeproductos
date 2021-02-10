const express = require('express')
const app = express()
const router = express.Router()


app.use(express.json())
app.use(express.urlencoded({extended: true}))

let productos = []

router.get('/', function (req, res) {
  res.send('Hello World')
})



router.get('/productos', (req, res) => {
    if (productos == 0) {
    res.json("No hay productos para mostrar")
    }
    res.json(productos)
})
 
router.get('/productos/:id', (req, res) => {
    const id = req.params.id
    const producto = productos.find( producto => producto.id == id)
    if(!producto) {
        res.status(404).json("El producto no existe")
        
    }
    res.json(producto)
})

router.post('/productos', (req, res) => {
    const { titulo, precio, foto} = req.body
    const producto = {
        titulo,
        precio,
        foto,
        id: productos.length+1
    }
    productos.push(producto)
    res.send(producto)
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
    res.send(producto)
}) 

app.delete('/api/productos/:id', (req, res) => {
    const id = req.params.id
    const producto = productos.find( producto => producto.id == id)
    if(!producto) {
        res.status(404).json("El producto no existe")
    }
    productos = productos.filter( producto => producto.id === id)
    res.send(producto)
})


app.use('/api', router)

app.listen(8080, () => {
    console.log("El servidor esta corriendo en el puerto 8080");
})