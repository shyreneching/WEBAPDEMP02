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
} = require("../model/user")
const {
  Leaderboard
} = require("../model/leaderboard.js")

const app = express()
const urlencoder = bodyparser.urlencoded({
  extended: false
})
const router = express.Router();

router.get('/', (request, response) => {
    Leaderboard.find({},
    //   ['username','time','date'],
    //   {
    //     skip: 0, // Starting Row
    //     limit: 5, // Ending Row
    //     sort: {
    //       time: 1 //Sort by Date Added ASCEN
    //     }
    //   },
      function (err, list) {
          if(err) {
              res.send(err)
          } else {
                console.log(list);
                if (!request.session.username) {
                // response.sendFile(__dirname + "/views/Login.html")
                response.render("Login_no_error.hbs")
                } else {
                if (list != "") {
                    console.log("I have a list")
                    response.render("Dashboard.hbs", {
                    leaderboard: list,
                    nav: "PROFILE"
                    })
                } else {
                    console.log("I don't")
                    response.render("Dashboard.hbs", {
                    nav: "PROFILE"
                    })
                }
                }
            }
      })
  })
  
  router.get("/profile", function(req, res){
      var temp;
      Leaderboard.find({},(err, list)=>{
          if(err) {
              res.send(err)
          } else {
              console.log(list)
              temp = list;
          }
      })
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
            password: doc.password,
            leaderboard: temp
          })
      }else{
        res.redirect("/")
      }
      })
    }
  })
  
  router.post("/login", urlencoder, function(req, res){
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
            res.render("Login.hbs")
        }
    })   
  })
  
  
  router.get("/leaderboard", function (request, response) {
    Leaderboard.find({},
    //     ).sort({
    //     time: 1
    //   })
    //   .limit(20).then(leaderboard => leaderboard[0].time)
    function(err, list) {
        if(err) {
            response.send(err)
        }else {
            console.log(list);
            if(!request.session.username) {
                response.render("Leaderboard.hbs", {
                  leaderboard: list,
                  nav: "GUEST"
                })
              } else {
                response.render("Leaderboard.hbs", {
                  leaderboard: list,
                  nav: "PROFILE"
                })
              }
        }
    })
    })
      
    //  res.session.destroy((err)=>{
    //     console.log("Error")
    //  })
    // res.redirect("/")
//   })
  
  router.get("/signup", (request, response) => {
    // response.sendFile(__dirname + "/views/SignUp.html")
    response.render("SignUp.hbs")
  })
  
  router.get("/dashboard", (request, response) => {
    Leaderboard.find({},
    //   ['username','time','date'],
    //   {
    //     skip: 0, // Starting Row
    //     limit: 5, // Ending Row
    //     sort: {
    //       time: 1 //Sort by Date Added ASCEN
    //     }
    //   },
      function (err, list) {
          if(err) {
              response.send(err)
          } else {
            if(!request.session.username) {
                if(list != null){
                  console.log("I have a list")
                  response.render("Dashboard.hbs", {
                    leaderboard: list,
                    nav: "GUEST"
                  })
                }else{
                  console.log("I don't")
                  response.render("Dashboard.hbs", {
                    nav: "GUEST"
                  })
                }
              } else {
                if(list != null){
                  console.log("I have a list")
                  response.render("Dashboard.hbs", {
                    leaderboard: list,
                    nav: "PROFILE"
                  })
                }else{
                  console.log("I don't")
                  response.render("Dashboard.hbs", {
                    nav: "PROFILE"
                  })
                }
            }
          }
        
      })    
  })
  
  router.post("/again", urlencoder, (req, res)=>{
    if (!req.session.username) {
      res.redirect("/game")
    } else {
      var time = req.body.time
      let temp = new Date()
      let x = new Leaderboard({
        username: req.session.username,
        time: time,
        date: temp.getTime(),
        path: req.body.path
      })
      x.save().then((doc) => {
        res.redirect("/game")
      }, (err) => {
        res.send(err)
      })
    }
    
  })
  
  router.post("/createaccount", urlencoder, (request, response) => {
    var username = request.body.user
    var password = request.body.pww
    var cpassword = request.body.confirm_pww
    var temp;
      Leaderboard.find({},(err, list)=>{
          if(err) {
              res.send(err)
          } else {
              console.log(list)
              temp = list;
          }
      })
      // time: 1
    //if same ung pangalan ng variable, pwede v for shortcut
    // let x = new Leaderboard({
    //   username: username,
    //   time: 300,
    //   date: new Date()
    // })
    // x.save().then((doc)=>{})
    let user = new Account({
      username: username,
  
      password: password
    })
    if (password == cpassword) {
      Account.findOne({
          username
      }, (err, doc)=>{
          if(err){
              res.send(err)
          }else if(doc){
              response.render("SignUp_with_error.hbs")
          }else{
            user.save().then((doc) => {
                request.session.username = username
              //if all goes well
              if(temp != ""){
                response.render("Dashboard.hbs", {
                  leaderboard: temp,
                  nav: "PROFILE"
                })
              }else{
                response.render("Dashboard.hbs",{
                  nav: "PROFILE"
                })
              }
              
            }, (err) => {
              //if it fails
              res.send(err)
            })
          }
      })   
    } else {
      response.render("SignUp_with_error.hbs")
    }
  })
  
  router.get('/game', (request, response) => {
    // response.sendFile(__dirname + '/views/guestview.hbs')
    if (!request.session.username) {
      response.render('guestview.hbs', {
        nav: "GUEST"
      })
    } else {
      response.render('guestview.hbs', {
        nav: "PROFILE"
      })
    }
  })
  
  router.get("/logout", function(request, response){
    response.render("Login_no_error.hbs")
    request.session.username = null
  })
  
  
  router.get('/articles', (request, response) => {
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
  
  
  module.exports = router;