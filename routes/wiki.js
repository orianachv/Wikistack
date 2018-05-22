const express = require('express');
const wikiRouter = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

wikiRouter.get('/', function(req, res, next) {
  res.redirect('/');
});
wikiRouter.post('/', function(req, res, next) {
  //   res.send('funcionó POST /wiki/');
  var page = Page.build({
    title: req.body.title,
    content: req.body.content,
  });
  page
    .save()
    .then(savedPage => {
      res.redirect(savedPage.route); // route virtual FTW
    })
    // .catch(next)
    .then(console.log(req.body));
});
wikiRouter.get('/add', function(req, res, next) {
  res.render('addpage');
  next();
});
wikiRouter.get('/:urlTitle', function(req, res, next) {
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle,
    },
  })
    .then(function(foundPage) {
      res.render('wikipage', foundPage);
    })
    .catch(next);
});

module.exports = wikiRouter;
