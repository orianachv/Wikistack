const routes = require('./routes/');
var morgan = require('morgan');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var path = require('path');
var models = require('./models');

// app.use(
//   morgan(':method :url :status :res[content-length] - :response-time ms'),
// );
app.use(express.static(path.join(__dirname, '/public')));

//configuración de bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//configuración de nunjucks
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', { noCache: true });

app.use('/', routes);

//Sincronizando sequalize con DB
models.User.sync({})
  .then(function() {
    return models.Page.sync({ force: true });
  })
  .then(function() {
    // asegurate de reemplazar el nombre de abajo con tu app de express
    app.listen(3000, function() {
      console.log('Server is listening on port 3000!👍 👍');
    });
  })
  .catch(console.error);
