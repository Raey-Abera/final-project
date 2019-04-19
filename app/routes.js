module.exports = function(ObjectId, app, passport, db) {
const fetch = require('node-fetch');// installed node-fetch to enable server-side fetch in court routes
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION ==============================================================
  app.get('/profile', isLoggedIn, function(req, res) {
    db.collection('courts').find().toArray((err, courts) => {
      if (err) return console.log(err)
      console.log(courts)
      // console.log(courts)
      db.collection('games').find().toArray((err, games) => {
        if (err) return console.log(err)
        // console.log('hello', games)
        const gamesUpdated= games.map(game => {//map is returning a new array
          if (game.players.length===10){//condition to set games as full if there are 10 players registered
            game.fullGame = true
          }
          return game//returning the game object
        })
        console.log(gamesUpdated)
        // console.log(games)
        res.render('map.ejs', {
          user : req.user,
          court: courts,
          games: gamesUpdated
        })
      })
    })
  });


  // ============================================================================

  const API_KEY = 'AIzaSyDLa-Y8sYQtEwMsS27acKPci1WHBQH_330';

  app.get('/court', isLoggedIn, function(req, res) {
    // console.log("this is req query name" + req.query.courtName)
    const bbCourt= req.query.courtName
    // console.log(bbCourt)
    db.collection('courts').findOne({"name": bbCourt},(err, court) => { //filtering courts by the name key to ensure that the first court found isn't the only one being used
      if (err) return console.log(err)
      console.log("these are the courts", court, bbCourt)
      db.collection('games').find().toArray((err, games) => {
        if (err) return console.log(err)
        // const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${court.googleId}&fields=name,rating,formatted_phone_number&key=${API_KEY}`
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${court.googleId}&key=${API_KEY}`
        console.log(detailsUrl)
        fetch(detailsUrl)
        .then(response => response.json())
        .then((courtDetails) => {
          console.log(courtDetails)
          res.render('court.ejs', {
            user : req.user,
            court: court,
            games: games,
            bbCourt,
            courtDetails
          })
        })
        // console.log(games)
      })
    })
  });

  // LOGOUT ==================================================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // API ROUTES ===============================================================

  app.post('/api/court', (req, res) => {
    db.collection('games').save({
      host: req.body.userName,
      courtName:req.body.courtName,
      date:req.body.date,
      startTime:req.body.startTime,
      stopTime:req.body.stopTime,
      fullGame: false,
      players:[]
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  })

  app.put('/api/players', (req, res) => {
    // console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"+req)
    // console.log(" this is the stuff Im looking atttttttttttt" + req, req.body, req.body.gameid, req.body.userid)
    console.log('Im running', req.body.userId)
    db.collection('games')
    .findOneAndUpdate({_id: ObjectId(req.body.gameId), players: { $nin: [req.body.userId] } }, {
      // if the userid is not in the array, run the follwing push
      // $nin selects the documents where the field value is not in the specified array or the field does not exist.
      $push: { players: req.body.userId }
    }, (err, result) => {
      console.log(err, result);
     if (err) return res.send(err)
     res.redirect('/profile')
   })
  })


  app.put('/removal', (req, res) => {
    console.log('balllllin', req.body.userId)
    db.collection('games')
    .findOneAndUpdate({_id: ObjectId(req.body.gameId)}, {//checking to see if the userid is not in the array. if this is true, run the follwing push
      $pull: { players: req.body.userId }
    }, (err, result) => {
      console.log(err, result);
     if (err) return res.send(err)
     res.redirect('/profile')
   })
  })
  // enclose findOneAndUpdate in find one
  // running with same filter ( use same ObjectId)

  // if condtion to see if playerId matches a playerId in the array in the game object, then see flash
  // const playerUpdated= games.map(game => {
  //   if (player == userId){
  //     do something
  //   }
  //   return game
  // })
  // console.log(playersUpdated)
  // pass in playersUpdated

  // app.delete('/', (req, res) => {
  //   db.collection('').findOneAndDelete({games: req.body.games}, (err, result) => {
  //     if (err) return res.send(500, err)
  //     res.send('Message deleted!')
  //   })
  // })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // SIGNUP ===============================================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user            = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
  return next();

  res.redirect('/');
}
