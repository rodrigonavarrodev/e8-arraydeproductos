const express = require('express')
const app = express()
 

app.use(express.json())
app.use(express.urlencoded({extended: true}))

let productos = []

app.get('/', function (req, res) {
  res.send('Hello World')
})



app.get('/api/productos', (req, res) => {
    if (productos == 0) {
    res.json("No hay productos para mostrar")
    }
    res.json(productos)
})
 
app.get('/api/productos/:id', (req, res) => {
    const id = req.params.id
    const producto = productos.find( producto => producto.id == id)
    if(!producto) {
        res.status(404).json("El producto no existe")
        
    }
    res.json(producto)
})

app.post('/api/productos', (req, res) => {
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

app.listen(8080, () => {
    console.log("El servidor esta corriendo en el puerto 8080");
})