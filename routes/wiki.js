const express = require('express');
const wikiRouter = express.Router();
var models = require('../models');
var Page = models.Page; 
var User = models.User; 





wikiRouter.get('/', function(req, res, next) {
    res.redirect('/');
});
wikiRouter.post('/', function(req, res, next) {
    res.send('funcionó POST /wiki/');
    var page = Page.build({
        title: req.body.title,
        content: req.body.content
      });
    page.save();
});
wikiRouter.get('/add', function(req, res, next) {
    res.render('addpage');
});


module.exports = wikiRouter;