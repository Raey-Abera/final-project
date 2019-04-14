module.exports = function(app, passport, db) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function(req, res) {
    db.collection('courts').find().toArray((err, courts) => {
      if (err) return console.log(err)
      console.log(courts)
      res.render('map.ejs', {
        user : req.user,
        court: courts
      })
    })
  });

  app.get('/court/:id', isLoggedIn, function(req, res) {
    const courtId= req.param.id
    db.collection('courts').findOne((err, court) => {
      if (err) return console.log(err)
      db.collection('games').find().toArray((err, games) => {
        if (err) return console.log(err)
        console.log(games)
        res.render('court.ejs', {
          user : req.user,
          court: court,
          games: games
        })
      })
    })
  });

  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // API ROUTES ===============================================================

  app.post('/api/court', (req, res) => {
    db.collection('games').save({host: req.body.userName, courtId:req.body.courtId, date:req.body.date, attendees:[]}, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  })

  //these have not been updated to match the corresponding db colletion and properties. 

  // app.put('/entries', (req, res) => {
  //   db.collection('entries')
  //   .findOneAndUpdate({games: req.body.games, location: req.body.location}, {
  //   }, {
  //     sort: {_id: -1},
  //     upsert: true
  //   }, (err, result) => {
  //     if (err) return res.send(err)
  //     res.send(result)
  //   })
  // })
  //
  // app.delete('/entries', (req, res) => {
  //   db.collection('entries').findOneAndDelete({games: req.body.games, location: req.body.location}, (err, result) => {
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

  // SIGNUP =================================
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
