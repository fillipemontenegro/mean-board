var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

router.post('/', function (req, res, next) {
    var user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: bcrypt.hashSync(req.body.password, 10),
      email: req.body.email
    });
    user.save(function(err, result){
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      res.status(201).json({
        message: 'User saved',
        obj: result
      });
    });
});

router.post('/signin', function (req, res, next) {
  User.findOne({email: req.body.email}, function (err, user) {
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    if (!user) {
      return res.status(401).json({
        title: 'Signin failed',
        error: {message: 'Invalid sigin credentials'}
      });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        title: 'Signin failed',
        error: {message: 'Invalid sigin credentials'}
      });
    }
    var token = jwt.sign({user: user}, 'FA4t434greG44ffE4g5j60hkTskg', {expiresIn: 7200});
    res.status(200).json({
      message: 'Sigin successful',
      token: token,
      userId: user._id
    });
  });
});

module.exports = router;
