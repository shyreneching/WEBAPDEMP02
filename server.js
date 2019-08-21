const express = require('express')
const bodyparser = require("body-parser")
const session = require("express-session")
const cookieparser = require("cookie-parser")
const mongoose = require("mongoose")
const Request = require('request')
const jsdom = require('jsdom')
const {
  JSDOM
} = jsdom;

const {
  Account
} = require("./model/user.js")
const {
  Leaderboard
} = require("./model/leaderboard.js")

// const path = require("path");
const app = express()
const urlencoder = bodyparser.urlencoded({
  extended: false
})


// var exphbs = require('express-handlebars');
// var hbs = exphbs.create({
//     helpers: {
//         number: function (count) { return count + 1 },
//         time: function (timespent) {
//             return Math.floor(timeSpent / 1000 / 60) + " min " + Math.round(timeSpent/1000%60) + " sec";
//         }
//     },
//     defaultLayout: 'main',
//     // partialsDir: ['views/partials/']
// });
// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');
// // app.set('views', path.join(__dirname, 'views'));




mongoose.Promise = global.Promise
//mongoose.connect(process.env.MONGODB_URI).catch(err => console.log(err))

mongoose.connect("mongodb://localhost:27017/wikigame", {
  useNewUrlParser: true
}).catch(err => console.log(err))

app.use(express.static('public'))
// app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "le secret",
  name: "wikigame",
  resave: true, //will receive the session id
  saveUninitialized: true, // no session yet will be saved
  cookie: {
    maxAge: 1000 * 60 * 24 * 365 * 2
  }
}))
app.use(cookieparser())
app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'views'));
app.set('views', 'views');
app.use(require("./controller"));

app.listen(process.env.PORT || 3000, function () {
  console.log("Now listening in port 3000...")
})

