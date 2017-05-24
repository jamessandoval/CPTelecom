// app.js

var express = require('express'),
    user = require('./routes/user'),
    routes = require('./routes/index'),
    bodyParser = require('body-parser'),
    handlebars = require('express-handlebars'),
    passport = require('passport'),
    flash = require('connect-flash'),
    mysql = require('mysql'),
    session = require('express-session'),
    mySQlStore = require('express-mysql-session')(session);

var path = require('path');

var app = express();

app.use(flash());

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./config/passport')(passport);

app.use(passport.initialize());

var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
 
var options = {
    host: 'localhost',
    user: 'root',
    password: 'Halcyon17',
    database: 'cptelecom',
    checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds. 
    expiration: 86400000,// The maximum age of a valid session; milliseconds. 
    createDatabaseTable: true,
};

var connection = mysql.createConnection(options);
var sessionStore = new mySQlStore(options);

app.use(session({
	key: 'session_cookie', 
    secret: 'secret',
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
}))


app.use(passport.session());

app.set('port', 3000);

// Set to true when in production mode
app.set('view cache', false);

app.use('/', routes);
app.use('/user', user);



var server = app.listen(app.get('port'), function() {
    console.log("Server Running.");

})
