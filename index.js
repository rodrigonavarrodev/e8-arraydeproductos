const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const handlebars = require("express-handlebars");
//const Producto = require("./models/producto");
const { db } = require("./models/producto");
const faker = require('faker')

require("dotenv").config();
require("./database");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials/",
  })
);

router.get("/", function (req, res) {
  //res.sendFile(path.join(__dirname, '/public', 'index.html'));
  res.render("productos");
});
/* 
router.get("/productos/:id", async (req, res) => {
  const id = req.params.id;
  let producto = await Producto.findById(id);
  res.json(producto);
});

router.post("/productos", async (req, res) => {
  const item = ({ producto, precio, foto } = new Producto(req.body));
  let result = await item.save();
  res.json(item);
});

router.get("/productos", async (req, res) => {
  let productos = await Producto.find();
  res.json(productos);
}); */

router.get("/faker", async (req, res) => {

  let cant = req.query.cant || 10
  console.log(cant);

  productos = []

  if(cant == 0) {
    const producto = {
      producto: "No hay productos"
    }
    productos.push(producto)
    res.render('productos', {productos, listExists: true})
  }

  
  for(let i=0; i < cant; i++) {
    
    const producto = {
      producto: faker.commerce.productName(),
      precio: faker.commerce.price(),
      foto: faker.image.imageUrl()
    }

  productos.push(producto)
  
  }
  
  res.render('productos', {productos, listExists: true})
});


router.delete("/productos/:id", async (req, res) => {
  const id = req.params.id;
  let producto = await Producto.findByIdAndDelete(id);
  res.json(producto);
})

app.use("/api", router);

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("public"));

app.listen(8080, () => {
  console.log("El servidor esta corriendo en el puerto 8080");
});
