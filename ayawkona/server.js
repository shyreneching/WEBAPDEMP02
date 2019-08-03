const express = require('express')
const Request = require('request')
const jsdom = require('jsdom')
const { JSDOM } = jsdom;

const app = express()

app.use(express.static('public'))

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.get('/articles', (request, response) => {
  const baseUrl = 'https://en.wikipedia.org';
  let article = request.query.article
  console.log('Getting requests for', article)
  
  Request({uri: baseUrl+article}, (error, resp, body) => {
    let filtered = []  
    if(!error && resp.statusCode == 200){
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
    for (let j=0; j<ignoredWords.length; j++) {
      if (text.includes(ignoredWords[j])) {
        skip = true  
      }
    }
    for (let j=0; j<ignoredLinks.length; j++) {
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
    for (let j=0; j<filtered.length; j++) {
      if (text === filtered[j].text) {
        skip = true
        break
      }
    }
    if (skip) {
      continue
    }

    let item = {text: text, href: link}
    filtered.push(item)
  }
  // console.log('number of articles: ', filtered.length)
  return filtered
}

app.listen(3000, function() {
    console.log("Now listening in port 3000")
})