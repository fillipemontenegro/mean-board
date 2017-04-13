var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

router.get('/', function (req, res, next) {
  Message.find()
    //Mongoose's populate() let's me get whatever property I need
    //from the user, since it's a reference (ref) in my user property in the message model
    // user: {type: Schema.Types.ObjectId, ref: 'User'}
    //                                     /\/\/\/\/\
    //Normally the property would only get the ID to the reference, not the object
    //.populate('name of the field I want to expend', 'name of property in referenced model')
    .populate('user', 'firstName')

    .exec(function(err, messages) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      res.status(200).json({
        message: 'Success',
        //could have called obj instead of messages
        messages: messages
      });
    });
});

///If you're not authenticated, the server won't even continue this code below
// .user(...) => every request reach it
router.use('/', function (req, res, next) {
  jwt.verify(req.query.token, 'FA4t434greG44ffE4g5j60hkTskg', function (err, decoded) {
    if (err) {
      return res.status(401).json({
        title: 'Not authenticated',
        error: err
      });
    }
    //If there's no error, simply continue. No response here, it's not the goal of this route
    next();
  })
});

router.post('/', function (req, res, next) {
  //The token validation was already done above at router.user
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function (err, user) {
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    var message = new Message({
      content: req.body.content,
      user: user
    });
    message.save(function (err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      user.messages.push(result);
      user.save();
      res.status(201).json({
        message: 'Message saved',
        obj: result
      });
    });
  });
});

router.patch('/:id', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);

  Message.findById(req.params.id, function(err, message) {
    if(err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    if(!message) {
      return res.status(500).json({
        title: 'No message found!',
        error: {message: 'Message not found.'}
      });
    }

    if(message.user != decoded.user._id) {
      return res.status(401).json({
        title: "Not authenticated",
        error: {message: "User not authenticated"}
      });
    }

    message.content = req.body.content;

    message.save(function (err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      res.status(200).json({
        message: 'Message updated',
        obj: result
      });
    });

  });
});

router.delete('/:id', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);

  Message.findById(req.params.id, function(err, message) {
    if(err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    if(!message) {
      return res.status(500).json({
        title: 'No message found!',
        error: {message: 'Message not found.'}
      });
    }

    if(message.user != decoded.user._id) {
      return res.status(401).json({
        title: "Not authenticated",
        error: {message: "User not authenticated"}
      });
    }

    message.remove(function (err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      res.status(200).json({
        message: 'Message deleted',
        obj: result
      });
    });

  });
});

module.exports = router;
