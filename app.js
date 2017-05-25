// app.js
var express = require('express'),
    user = require('./routes/user'),
    routes = require('./routes/index'),
    bodyParser = require('body-parser'),
    handlebars = require('express-handlebars'),
    passport = require('passport'),
    flash = require('connect-flash'),
    session = require('express-session');

var path = require('path');
require('./config/passport')(passport);

var app = express();

app.use(flash());

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
	  key: 'session_cookie',
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('port', 3000);

// Set to true when in production mode
app.set('view cache', false);

app.use('/', routes);
app.use('/user', user);



var server = app.listen(app.get('port'), function() {
    console.log("Server Running.");

})
