const express = require('express')
const app = express()
const router = express.Router()
const path = require('path');

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))


let productos = []

router.get('/', function (req, res) {
    res.render('form.ejs',{})
})


router.get('/productos', (req, res) => {
   
    res.render('productos.ejs', {productos})
})
 
router.get('/productos/:id', (req, res) => {
    const id = req.params.id
    const producto = productos.find( producto => producto.id == id)
    if(!producto) {
        res.status(404).json("El producto no existe")
        
    }
    res.render('productos.ejs', {productos})
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
    res.render('productos.ejs', {productos})

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
    res.render('productos.ejs', {productos})
}) 

app.delete('/productos/:id', (req, res) => {
    const id = req.params.id
    const producto = productos.find( producto => producto.id == id)
    if(!producto) {
        res.status(404).json("El producto no existe")
    }
    productos = productos.filter( producto => producto.id === id)
    res.render('productos.ejs', {productos})
})


app.use('/api', router)

app.listen(8080, () => {
    console.log("El servidor esta corriendo en el puerto 8080");
})