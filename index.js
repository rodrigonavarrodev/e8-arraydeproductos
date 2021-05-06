const express = require("express");
const app = express();
const router = express.Router();

//PASSPORT
const bcrypt = require("bcrypt");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const User = require('./models/user')

app.use(require('cookie-parser')())
app.use(require('express-session')({
  secret: 'secret',
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: 60000
  },
  rolling: true,
  resave: true,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

const bodyParser = require("body-parser");

const cookieParser = require("cookie-parser");


const { db } = require("./models/producto");
require("dotenv").config();
require("./database");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const validatePassword = function (user, password) {
  return bcrypt.compareSync(password, user.password);
};

const createHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

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
              return cb(null, newUser);
            });
          }
        });
      };
      process.nextTick(findOrCreateUser);
    }
  )
);
 
passport.use(
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
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


router.get("/", function (req, res) {
  res.json({ msg: "llegue" });
});


//LOGIN
app.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  (req, res) => {
    
    res.redirect("/");
  }
);

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/login/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.json('Login OK')
  }
);

app.get("/faillogin", (req, res) => {
  res.json("login-error", {});
});

//REGISTER
app.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  (req, res) => {
    res.json('regiser OK')
    //res.redirect("/");
  }
);

app.get("/failregister", (req, res) => {
  res.json("register-error", {});
});



app.listen(8080, () => {
  console.log("El servidor esta corriendo en el puerto 8080");
});
