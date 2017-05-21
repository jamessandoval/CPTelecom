// app.js

var express = require('express'),
routes = require('./routes/index'),
bodyParser = require('body-parser'),
hbs = require('express-handlebars'),
path = require('path');

var app = express();

app.engine('handlebars', hbs({defaultLayout: 'main'}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', 3000);

// Set to true when in production mode
app.set('view cache', false);

app.use('/', routes);

var server = app.listen(app.get('port'), function(){
	console.log("Server Running.");

})




