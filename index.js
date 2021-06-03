const express = require("express");
const app = express();
const router = express.Router();

//PASSPORT
const bcrypt = require("bcrypt");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

//MAILS
const nodemailer = require("nodemailer");

//TWILIO
const accountSid = 'AC965ddab5fc5955a196e4dbf2ccfefc2b'
const authToken= '9fe8a154033cec00ca2e5686d9b3dea3'
const client = require('twilio')(accountSid, authToken)


const User = require("./models/user");

app.use(require("cookie-parser")());
app.use(
  require("express-session")({
    secret: "secret",
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 60000,
    },
    rolling: true,
    resave: true,
    saveUninitialized: false,
  })
);


app.use(passport.initialize());
app.use(passport.session());

const bodyParser = require("body-parser");

const cookieParser = require("cookie-parser");

const { db } = require("./models/producto");
require("dotenv").config();
require("./database");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configuracion nodemailer con ethereal
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "brendan24@ethereal.email",
    pass: "A7tVQRmgT6kK6s63F9",
  },
});

//configuracion nodemailer con gmail
const transporterGmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "rodrigonavarrodg@gmail.com",
    pass: "*********",
  },
});


const validatePassword = function (user, password) {
  return bcrypt.compareSync(password, user.password);
};

const createHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

passport.use(
  "login",
  new localStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, cb) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          console.log("User Not Found with username " + username);
          return cb(null, false);
        }
        if (!validatePassword(user, password)) {
          console.log("Invalid Password");
          return cb(null, false);
        }
        
        req.session.username = username

        const mailOptions = {
          from: "test Coderhouse from GMAIL",
          to: "rodrigonavarrodg@gmail.com",
          subject: "logIn",
          html: `<h1>Lo logue el usuario ${username}</h1>`,
          attachments: [
            {
              path: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcincodias.elpais.com%2Fcincodias%2F2016%2F07%2F04%2Flifestyle%2F1467646262_522853.html&psig=AOvVaw3oXZz4fFOyhBk4MEPqCxSQ&ust=1622775860994000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCMie2ae9-vACFQAAAAAdAAAAABAD"
            }
          ]
        };
        transporterGmail.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
            return err;
          }
          console.log(info);
        });

        return cb(null, user);
      });
    }
  )
);

passport.use(
  "register",
  new localStrategy(
    {
      passReqToCallback: true,
    },
    function (req, username, password, cb) {
      const findOrCreateUser = function () {
        User.findOne({ username: username }, function (err, user) {
          if (err) {
            console.log("Error in SignUp: " + err);
            return cb(err);
          }
          if (user) {
            console.log("User already exists");
            return cb(null, false);
          } else {
            var newUser = new User();
            newUser.username = username;
            newUser.password = createHash(password);
            newUser.save((err) => {
              if (err) {
                console.log("Error in Saving user: " + err);
                throw err;
              }
              console.log("User Registration succesful");
 
              //envio un email a la persona que se registro
              const mailOptions = {
                from: "test Coderhouse Ethereal",
                to: username,
                subject: "Registro",
                html: `<h1>Bienvenido ${username}</h1>`,
              };
              transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                  console.log(err);
                  return err;
                }
                console.log(info);
              });

              //envio un SMS avisando que un usuario se registro

              client.messages.create({
                body: `Se registro un nuevo nuevo usuario con el email ${username}`,
                from: '+17192590732',
                to: '+5491165048738'
              })
              .then(message => console.log(message.sid))
              .catch(console.log())
              
              return cb(null, newUser);
            });
          }
        });
      };
      process.nextTick(findOrCreateUser);
    }
  )
);

/* passport.use(
  "facebook",
  new FacebookStrategy(
    {
      clientID: "518252845843895",
      clientSecret: "5a87ecbd91cc95d87205d9efe288dc26",
      callbackURL: "http://localhost:8080/login/facebook/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log('entre');
      const findOrCreateUser = function () {
        User.findOne({ facebookId: profile.id }, function (err, user) {
          if (err) {
            console.log("Error in SignUp: " + err);
            return cb(err);
          }
          if (user) {
            console.log("User already exists");
            return cb(null, false);
          } else {
            var newUser = new User();
            newUser.facebookId = profile.id;
            newUser.username = profile.displayName;
            newUser.save((err) => {
              if (err) {
                console.log("Error in Saving user: " + err);
                throw err;
              }
              console.log("User Registration succesful");
              console.log(profile);
              return cb(null, newUser);
            });
          }
        });
      };
      process.nextTick(findOrCreateUser);
    }
  )
); */

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.get("/", (req, res) => {
  res.json({ msg: "llegue" });
});

//LOGIN POR FORMULARIO
app.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  (req, res) => {
    console.log(req.session);
    res.json("Login OK");
    //res.redirect("/");
  }
);

app.get("/faillogin", (req, res) => {
  res.json("login-error", {});
});

//REGISTER POR FORMULARIO
app.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  (req, res) => {
    res.json("regiser OK");
    //res.redirect("/");
  }
);

app.get("/failregister", (req, res) => {
  res.json("register-error", {});
});


//LOGOUT
app.get('/logout', async (req, res) => {
  const username = req.session.username;
  req.session.destroy(err => {
    if(!err){
      res.send({msg: `Hasta luego ${username}`})
    }
  })
})


/* //REGISTER CON FACEBOOK
app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/login/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.json('Login OK')
  }
); */

app.listen(3000, () => {
  console.log("El servidor esta corriendo en el puerto 3000");
});
