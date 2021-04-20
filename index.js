const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const cookieParser = require("cookie-parser")
const session = require('express-session')

const handlebars = require("express-handlebars");
const { db } = require("./models/producto");

require("dotenv").config();
require("./database");

app.use(cookieParser())
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
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
}); 

router.delete("/productos/:id", async (req, res) => {
  const id = req.params.id;
  let producto = await Producto.findByIdAndDelete(id);
  res.json(producto);
})

//--------- SESSION -------------------


router.post('/login', async (req, res) => {
  const { username } = req.body

  req.session.username = username
  req.session.cookie.expires = new Date(Date.now() + 60000)
  //Verificacion de que el usuario esta logueado con la misma session al actualizar
  console.log(req.sessionID);
  res.send(`Bienvenido ${req.session.username}`)
})

router.get('/logout', async (req, res) => {
  const username = req.session.username;
  req.session.destroy(err => {
    if(!err){
      res.send(`Hasta luego ${username}`)
    }
  })
})









//--------- SESSION -------------------


app.use("/api", router);

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("public"));

app.listen(8080, () => {
  console.log("El servidor esta corriendo en el puerto 8080");
});
