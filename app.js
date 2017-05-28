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
	request = require('request');

var path = require('path');
require('./config/passport')(passport);
var mysql = require('./models/dbconnect.js');

var schedule = require('node-schedule');

//John's API Key for Indeed.com and our max scraping number
var indeedAPI = "2648850467422389";
var jobsPerPage = 20;

var job = schedule.scheduleJob('* * /12 * * *', function(){
	//runs the code here every 12 hours
	console.log("test\n");
	scrapeIndeed();
	
});

var app = express();

function scrapeIndeed(){
	/*var url = "http://api.indeed.com/ads/apisearch?publisher=" + indeedAPI + "&format=json"
	+ "&l=remote" + "&start=0" + "&limit=" + jobsPerPage + "&co=us&userip=1.2.3.4"
		+ "&useragent=Mozilla/%2F4.0%28Firefox%29" + "v=2";*/
	
var url = "http://api.indeed.com/ads/apisearch?publisher=" + indeedAPI + "&format=json&l=remote&sort=&radius=&st=&jt=&start=&limit=" + jobsPerPage + "&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2"
	
	request.get(url, function(error, indRes, indRet){
		
		var jobs = JSON.parse(indRet);
		
		console.log(jobs.results[0]);
			
		//drops table if it exists then creates new one
		var context = {};
		  mysql.pool.query("DROP TABLE IF EXISTS indeedJobs", function(err){
			var createString = "CREATE TABLE indeedJobs(" +
			"id INT PRIMARY KEY AUTO_INCREMENT," +
			"jobTitle VARCHAR(255) NOT NULL," +
			"company VARCHAR(255) NOT NULL," + 
			"daysAgo VARCHAR(255) NOT NULL,"+
			"url TEXT NOT NULL, " +
			"snippet TEXT NOT NULL)";
			mysql.pool.query(createString, function(err){
			  context.results = "Job Table reset";
			  res.setHeader('Content-Type', 'application/json');
			  res.send(context);
			})
		  });
		
		for(i = 0; i < jobsPerPage; i++){
			console.log("Current Job: " + i)
			//just for testing
			console.log("jobtitle: " + jobs.results[i].jobtitle);
				// disabled mysql due to errors
				/*mysql.pool.query("INSERT INTO indeedJobs (jobTitle, company, daysAgo, snippet) VALUES (?, ?, ?, ?, ?)", [jobs.results[i].jobtitle, jobs.results[i].company, jobs.results[i].formattedRelativeTime, jobs.results[i].url, jobs.results[i].snippet],
				function(err, result){
					if(err){
						next(err);
						return;
					}
			
				});*/
			}
	});
}

scrapeIndeed();



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
