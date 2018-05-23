const express = require('express');
const userRouter = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

userRouter.get('/', function(req, res, next) {
  User.findAll()
    .then(users => res.render('users', { users }))
    .catch(next);
});

userRouter.get('/:userId', function(req, res, next) {
  var userPromise = User.findById(req.params.userId);
  var pagesPromise = Page.findAll({
    where: {
      authorId: req.params.userId,
    },
  });

  Promise.all([userPromise, pagesPromise])
    .then(function(values) {
      var user = values[0];
      var pages = values[1];
      res.render('user', { user: user, pages: pages });
    })
    .catch(next);
});
module.exports = userRouter;
