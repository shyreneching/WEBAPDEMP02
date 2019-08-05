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

const app = express()
const urlencoder = bodyparser.urlencoded({
  extended: false
})

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/wikigame", {
  useNewUrlParser: true
})

app.use(express.static('public'))
app.use(session({
  secret: "secret name",
  name: "cookiename",
  resave: true, //will receive the session id
  saveUninitialized: true, // no session yet will be saved
  cookie: {
    maxAge: 1000 * 60 * 24 * 365 * 2
  }
}))

app.use(cookieparser())



app.get('/', (request, response) => {
  //.sort = sort time, .limit(5) = gets the smallest 5?
  var list = Leaderboard.find({}).sort({
      time: 1
    })
    .limit(5).then(leaderboard => leaderboard[0].time)
  // response.sendFile(__dirname + '/views/guestview.hbs')
  if (!request.session.username) {
    // response.sendFile(__dirname + "/views/Login.html")
    response.render("Login.hbs")
  } else {
    console.log(list)
    if(list != null){
      console.log("I have a list")
      response.render("Dashboard.hbs", {
        leaderboard: list
      })
    }else{
      console.log("I don't")
      response.render("Dashboard.hbs")
    }
  }
})

app.get("/profile", function(req, res){
  if (!req.session.username) {
    res.redirect("/")
  } else {
    let username = req.session.username;
    Account.findOne({
      username
    }, (err, doc)=>{
      if(err){
        res.send(err)
    }else if(doc){
        console.log(doc)
        res.render("profile.hbs", {
          username: doc.username,
          password: doc.password
        })
    }else{
      res.redirect("/")
    }
    })
  }
})

app.post("/login", urlencoder, function(req, res){
  let username = req.body.user
  let password = req.body.pww
  
  Account.findOne({
      username,
      password
  }, (err, doc)=>{
      if(err){
          res.send(err)
      }else if(doc){
          console.log(doc)
          req.session.username = doc.username
          res.redirect("/")
      }else{
          escape.send("user not found")
      }
  })   
})


app.get("/leaderboard", function (request, response) {
  var list = Leaderboard.find({}).sort({
      time: 1
    })
    .limit(20).then(leaderboard => leaderboard[0].time)
  response.render("Leaderboard.hbs", {
    leaderboard: list
  })
  //  res.session.destroy((err)=>{
  //     console.log("Error")
  //  })
  // res.redirect("/")
})

app.get("/signup", (request, response) => {
  // response.sendFile(__dirname + "/views/SignUp.html")
  response.render("SignUp.hbs")
})

app.get("/dashboard", (request, response) => {
  var list = Leaderboard.find({}).sort({
    time: 1
  })
  .limit(5).then(leaderboard => leaderboard[0].time)
  console.log(list)
    if(list != null){
      console.log("I have a list")
      response.render("Dashboard.hbs", {
        leaderboard: list
      })
    }else{
      console.log("I don't")
      response.render("Dashboard.hbs")
    }
})

app.post("/createaccount", urlencoder, (request, response) => {
  var username = request.body.user
  var password = request.body.pww
  var cpassword = request.body.confirm_pww
  var list = Leaderboard.find({}).sort({
    time: 1
    })
    .limit(5).then(leaderboard => leaderboard[0].time)
    // time: 1
  //if same ung pangalan ng variable, pwede v for shortcut
  let x = new Leaderboard({
    username: username,
    time: 300,
    date: new Date()
  })
  x.save().then((doc)=>{})
  let user = new Account({
    username: username,

    password: password
  })
  if (password == cpassword) {
    user.save().then((doc) => {
      //if all goes well
      if(list != null){
        response.render("Dashboard.hbs", {
          leaderboard: list
        })
      }else{
        response.render("Dashboard.hbs")
      }
      
    }, (err) => {
      //if it fails
      res.send(err)
    })
  }
})

app.get('/game', (request, response) => {
  // response.sendFile(__dirname + '/views/guestview.hbs')
  response.render('guestview.hbs', {})
})

app.get('/articles', (request, response) => {
  const baseUrl = 'https://en.wikipedia.org';
  let article = request.query.article
  console.log('Getting requests for', article)

  Request({
    uri: baseUrl + article
  }, (error, resp, body) => {
    let filtered = []
    if (!error && resp.statusCode == 200) {
      const dom = new JSDOM(body);
      let summary = dom.window.document.querySelectorAll('.mw-parser-output > p')[0].textContent
      if (summary.length < 100) {
        // heuristic to pick first relevant summary
        summary = dom.window.document.querySelectorAll('.mw-parser-output > p')[1].textContent
      }
      const title = dom.window.document.querySelector('#firstHeading').textContent

      // get all links
      const links = dom.window.document.querySelectorAll('#bodyContent a')
      filtered = filterLinks(links)
      const payload = {
        links: filtered,
        summary: summary,
        title: title,
        href: article,
      }
      response.send(payload)
    }
  })
})

// const listener = app.listen(process.env.PORT, () => {
//   console.log(`Your app is listening on port ${listener.address().port}`)
// })

function filterLinks(links) {
  const filtered = []
  // very ad hoc method of filtering
  const ignoredWords = [
    '/',
    'disambiguation',
    'doi',
    'article',
    'Article',
    'Wikipedia indefinitely semi-protected pages',
    'Wikidata',
    'Wikipedia',
    'Certification Table Entry',
  ]
  const ignoredLinks = [
    'Special:Search',
    'Help:',
    'Wikipedia:Verifiability',
  ]
  for (let i = 0; i < links.length; ++i) {
    const text = links[i].title
    const link = links[i].href
    // removes lots of strange articles
    if (text.length < 2) {
      continue
    }
    // get rid of all numbers (for now)
    if (text.match(/\d+/g) !== null) {
      continue
    }
    // avoid things like User:This_Person
    if (text.match(/\w:\w/g) !== null) {
      continue
    }
    if (link.match(/\w:\w/g) !== null) {
      continue
    }
    let skip = false
    // skip all ignored text and links
    for (let j = 0; j < ignoredWords.length; j++) {
      if (text.includes(ignoredWords[j])) {
        skip = true
      }
    }
    for (let j = 0; j < ignoredLinks.length; j++) {
      if (link.includes(ignoredLinks[j])) {
        skip = true
      }
    }
    if (skip) {
      continue
    }
    // make sure they aren't weird editor notes 
    if (links[i].outerHTML.includes('<i')) {
      continue
    }
    // make sure href leads to wikipedia page
    if (!link.includes('/wiki/')) {
      continue
    }
    // lastly, make sure item doesn't exist already
    for (let j = 0; j < filtered.length; j++) {
      if (text === filtered[j].text) {
        skip = true
        break
      }
    }
    if (skip) {
      continue
    }

    let item = {
      text: text,
      href: link
    }
    filtered.push(item)
  }
  // console.log('number of articles: ', filtered.length)
  // for(let i = 0; i < filtered.length; i++)
  //   console.log(filtered[i].text + " " + filtered[i].href)
  return filtered
}



app.listen(3000, function () {
  console.log("Now listening in port 3000")
})