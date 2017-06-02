// app.js
var express = require('express'),
    user = require('./routes/user'),
    routes = require('./routes/index'),
    bodyParser = require('body-parser'),
    handlebars = require('express-handlebars'),
    passport = require('passport'),
    flash = require('connect-flash'),
    session = require('express-session'),
	mysql = require('mysql'),
	path = require('path'),
	scrapeIndeed = require('./taskRunner/indeedapi'),
	schedule = require('node-schedule'),
    connection = require('./models/dbconnect.js'),
    MySQLStore = require('express-mysql-session');

	var job = schedule.scheduleJob('* * /12 * * *', function() {
    //runs the code here every 12 hours
    console.log("test\n");
    scrapeIndeed();
});

require('./config/passport')(passport);
var app = express();

app.use(flash());

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());	

var options = {
    checkExpirationInterval: 1000 * 60 * 15, // 15 min
    expiration: 1000 * 60 * 60 * 24 * 7, // 1 week
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

var sessionStore = new MySQLStore(options, connection.pool);

app.use(session({
	  key: 'session_cookie',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.user = req.user || null;
    next();
})

app.set('port', 3000);

// Set to true when in production mode
app.set('view cache', false);

app.use('/', routes);
app.use('/user', user);

// *** Routes ***
app.use(function(req, res) {
    res.status(303);
    res.render('303');
});

app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

var server = app.listen(app.get('port'), function() {
    console.log("Server Running.");
	//scrapeIndeed();
})
