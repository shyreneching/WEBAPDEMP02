$(function() {
    var baseURL = 'https://en.wikipedia.org'
    var pathHistory = []
    var toStart = false
    var data, start, goal
    var starttime, endtime, timeSpent
  
    // loads preset list of articles for start and end
    function loadData() {
      return new Promise(function(resolve, reject) {
        console.log('loading things JSON...')
        // $.getJSON('https://cdn.glitch.com/40d55047-3eaa-44bf-ba59-73ebb3488dee%2Fthings.json?1522698967187', function(data) {
        //   console.log('loaded things!')
        //   resolve(data)
        // })
        $.getJSON('links.json', function(data) {
          console.log('loaded things!')
          resolve(data)
        })
      })
    }
    
    // create pretty colors!
    function generateColor() {
      var goldenRatio = 0.618033988749895  
      var h = ((Math.random()+ goldenRatio) % 1) * 256 
      return 'hsl(' + h + ',75%,90%)'
    }
    
    // get random element from list helper
    function getRandom(list) {
      return list[Math.floor(Math.random()*list.length)]
    }
  
    // adjust css for info to make sure things look pretty 
    function adjustInfo() {
      if ($('#article-title').width() + $('#goal-title').width() > 0.8 * window.innerWidth) {
        $('#info-wrapper').addClass('break')
      } else {
        $('#info-wrapper').removeClass('break')
      }
    }
    
    function checkWinCondition() {
      if (!pathHistory.length) {
        return 
      }
      if (pathHistory[pathHistory.length-1].href === goal.href) {
        endtime = new Date()
        console.log(endtime)
        $('#winning-wrapper ul').empty()
        pathHistory.forEach(function(node, i) {
          $('#winning-wrapper ul').append(
            $('<li/>')
              .text(node.text)
              .css('background-color', generateColor())
          )
        })
        timeSpent = endtime - starttime
        console.log(timeSpent)
        $('#winning-wrapper span').text(Math.floor(timeSpent / 1000 / 60) + " min " + Math.round(timeSpent/1000%60) + " sec")
        setActive(WINNING)
      }
    }
    
    // sets active view, budget MVC.
    var LOADING = "#loading-wrapper"
    var HELP = "#help-wrapper"
    var MAIN = "#main-wrapper"
    var ARTICLES = "#articles-wrapper"
    var WINNING = "#winning-wrapper"
    
    function setActive(view) {
      window.scrollTo(0, 0)
      $(LOADING).removeClass('active')
      $(HELP).removeClass('active')
      $(MAIN).removeClass('active')
      $(WINNING).removeClass('active')
      $(ARTICLES).addClass('active') 
      $('#info-wrapper').removeClass('win')
      switch(view) {
        case LOADING:
          $(LOADING).addClass('active')
          break
        case HELP:
          $(HELP).addClass('active')
          break
        case MAIN:
          $(MAIN).addClass('active')
          adjustInfo()
          break
        case WINNING:
          $('#info-wrapper').addClass('win')
          $(MAIN).addClass('active')
          $(WINNING).addClass('active')
          $(ARTICLES).removeClass('active')
          break;
        default: 
          console.log("unknown view set!")
      }
    }
  
    // restart game or cycle current round
    function restart(data) {
      location.hash = ""
      start = getRandom(data.things)
      goal = getRandom(data.things)
      // make sure we don't win at the start... 
      // and that we don't get numbers for the goal 
      while (start === goal && goal.match(/\d+/g) === null) {
        goal = getRandom(data.things)
      }
      // update DOM
      $('#start-help').text(start.text)
      $('#goal-help').text(goal.text)
      $('#goal-title a')
        .text(goal.text)
        .attr("href", baseURL + goal.href)
        .hover(function(e) {
          $(this).css('color',e.type === 'mouseenter'? generateColor() :'#000000') 
        })
  
      // clear history 
      pathHistory = []
      toStart = true
      setActive(HELP)
      starttime = new Date()
      console.log(starttime)
    }
    
    // request new list of links from backend
    function requestArticle(link, cb) {
      if (!link.match(/^\/wiki\/\w+$/) === null) {
        return cb()
      }
      setActive(LOADING)
      $('#loading-wrapper span').text(link) 
      $.get('/articles?article=' + link, function(payload) {
        // dom changes 
        $('#article-title a')
          .text(payload.title)
          .attr("href", baseURL + payload.href)
          .hover(function(e) {
            $(this).css('color',e.type === 'mouseenter'? generateColor() :'#000000') 
          })
        $('#article-summary').text(payload.summary)
        $('#articles-count').text(payload.links.length.toString() + " links found on the " + payload.title + " page")
        $('ul#articles').empty() 
  
        // create links
        payload.links.forEach(function(article, i) {
          var color = generateColor()
          $('ul#articles').append(
            $('<li/>')
              .append($('<a/>', {text: article.text, href: '/game#' + article.href}))
              .hover(function(e) {
                $(this).css('background-color',e.type === 'mouseenter'? color :'transparent') 
              })
          )
        })   
        pathHistory.push({'text': payload.title, 'href': payload.href})
        toStart = false
        setActive(MAIN)
        return cb()
      });
    }
  
    // restart
    $('#restart').on('click', function() {
      restart(data)
    })
    $('#replay').on('click', function() {
      $("#time").val(timeSpent)
      $("#timeform").submit();
      // restart(data)
    })
  
    // help modal
    $('#help').on('click', function() {
      setActive(HELP)
    })
  
    // close help modal
    $('#close-help').on('click', function() {
      if (toStart) {
        // request first article
        location.hash = start.href
      } else {
        setActive(MAIN)
      }
      checkWinCondition()
      $(".divisoria").css('display', 'none')
    })
  
    // set link colors
    $('.color-link').hover(function(e) {
      $(this).css('background-color',e.type === 'mouseenter'? generateColor() :'#efefef') 
    })
  
    // handle changes for navigations
    window.addEventListener('hashchange', function(e) {
      if (location.hash === "") {
        return
      }
      requestArticle(e.newURL.split('#')[1], checkWinCondition)
    });
  
    // handle resize to adjust css for main article titles
    window.addEventListener('resize', adjustInfo);
  
    // start main game
    loadData().then(function(resolution){
      data = resolution
      restart(data)
    })
  })
  