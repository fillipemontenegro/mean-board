var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/nodetst/:msg', function (req, res, next) {
    res.render('nodetst', {message: req.params.msg});
});

router.post('/nodetst', function (req, res, next) {
  var mess = req.body.message;
  res.redirect('/nodetst/' + mess);
});

router.get('/newuser', function (req, res, next) {

  User.findOne({}, function (err, usr) {
    if (err) {
      return res.send('Error!');
    }

    res.render('newuser', {usrName: usr});

  });

});

router.post('/newuser', function (req, res, next) {
  var email = req.body.email;
  var fName = req.body.firstName;
  var lName = req.body.lastName;
  var pass = req.body.password;

  var user = new User({
    firstName: fName,
    lastName: lName,
    email: email,
    password: pass
  });

  user.save();
  res.redirect('/');

});

module.exports = router;
