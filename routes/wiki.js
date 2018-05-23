const express = require('express');
const wikiRouter = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

wikiRouter.get('/', function(req, res) {
  // si vengo de la fincion de abajo,  o sea recibo un query, rendereo lo que me llega

  // si no,:
  Page.findAll().then(pages => res.render('index', { pages }));
});

wikiRouter.get('/search', function(req, res) {
  console.log('req.query', req.query);
  var arrayTags = req.query.search.split(' ');
  console.log(arrayTags);
  // Page.findByTag(tagFind).then(function(tagFind) {
  //   res.render('/', { tagFind });
  // });
  // aca lo redirecciono a '/'
});

wikiRouter.post('/', function(req, res, next) {
  console.log('entra al post');
  User.findOrCreate({
    where: {
      name: req.body.author,
      email: req.body.email,
    },
  })
    .then(function(values) {
      var user = values[0];
      var page = Page.build({
        title: req.body.title,
        content: req.body.content,
        urlTitle: req.body.title,
        tag: req.body.tags.split(','),
      });
      return page.save().then(function(page) {
        page.setAuthor(user); // route virtual FTW
        return page;
      });
    })
    .then(function(page) {
      console.log(page);
      res.redirect(page.urlTitle);
    })
    .catch(next);
});
wikiRouter.get('/add', function(req, res, next) {
  console.log('entra al add');
  res.render('addpage');
});

wikiRouter.get('/:urlTitle', function(req, res) {
  console.log('entra al :urlTitle');
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle,
    },
    include: [{ model: User, as: 'author' }],
  })
    .then(function(page) {
      if (!page) return res.send(404);
      res.render('wikipage', {
        page,
      });
    })
    .catch();
});

module.exports = wikiRouter;
