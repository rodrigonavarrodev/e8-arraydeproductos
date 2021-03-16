const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const handlebars = require("express-handlebars");
const { getProducts, getProductsByID, insertProducts } = require("./productoModel");


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
  res.render("form");
});


router.get("/productos/:id", async (req, res) => {
  const id = req.params.id;
  let productos = await getProductsByID(id);
  res.json(productos)
});


router.post("/productos", async (req, res) => {
    const item = ({ producto, precio, foto } = req.body);
    let result = await insertProducts(item);
    res.json(item)
   
  });


  router.get("/productos", async (req, res) => {
    let productos = await getProducts();
    res.json(productos)
  });




app.use("/api", router);

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("public"));

app.listen(8080, () => {
  console.log("El servidor esta corriendo en el puerto 8080");
});
