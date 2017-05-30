var connection = require('../models/dbconnect.js'),
    schedule = require('node-schedule'),
    request = require('request');

//John's API Key for Indeed.com and our max scraping number
var indeedAPI = "2648850467422389";
// cannot exceed 25 per page
var jobsPerPage = 25;
var dupCount = 0;
var addCount = 0;
var totalJobs = 10000;

var job = schedule.scheduleJob('* * /12 * * *', function() {
    //runs the code here every 12 hours
    console.log("test\n");
    scrapeIndeed();
});

function createIndeedTable() {
    var createString = "CREATE TABLE indeedJobs(" +
        "id INT PRIMARY KEY AUTO_INCREMENT," +
        "jobTitle VARCHAR(255) NOT NULL," +
        "company VARCHAR(255) NOT NULL," +
        "daysAgo VARCHAR(255) NOT NULL," +
        "url TEXT NOT NULL, " +
        "snippet TEXT NOT NULL, " +
        "date_scraped timestamp NOT NULL, " +
        "rating INT)";
    connection.pool.query(createString, function(err) {
        if (err)
            throw err;
    });

    console.log("new job table built.");
}

// check to see if item is a duplicate.
function addJob(item, index) {

    //console.log(index);
    //console.log(item);

    connection.query("SELECT * FROM indeedJobs WHERE jobTitle = ? AND snippet = ?", [item.jobTitle, item.snippet], function(err, rows) {
        if (err) {
            throw err;
        }
        if (rows.length) {
            console.log("duplicate found, not copying");
            dupCount++;
            return;
        } else {
            connection.pool.query("INSERT INTO indeedJobs (jobTitle, company, daysAgo, url, snippet) VALUES (?, ?, ?, ?, ?)", [item.jobtitle, item.company, item.formattedRelativeTime, item.url, item.snippet], function(err) {
                if (err) {
                    throw err;
                } else {
                    addCount++;
                    console.log("successfully added.");
                }
            });
        }
    });
};


module.exports = function() {

	var startJob = 0;
    connection.pool.query("SELECT * FROM indeedJobs", function(err, results) {
        // indeedJobs table exists ...drop for testing.
        if (results) {
            console.log("table exists, uncomment indeedapi line:41 to drop and rebuild.");
            
            /*connection.pool.query("DROP TABLE IF EXISTS indeedJobs", function(err, result) {
                if (err)
                    throw err;
                else if (result) {
                    // build a new jobs table
                    createIndeedTable();
                }
            });
            */
        } else {
            // build a new indeedJobs table 
            createIndeedTable();
        }
    });

    while (startJob <= totalJobs) {
        var url = "http://api.indeed.com/ads/apisearch?publisher=" + indeedAPI + "&format=json&l=remote&sort=date&radius=&st=&jt=&start=" + startJob + "&limit=" + jobsPerPage + "&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2";
        startJob += 25;

        request.get(url, function(error, res, ret) {
            // if no ret response
            if (!ret) return;
            var jobs = JSON.parse(ret);
            //console.log(jobs);
            jobs.results.forEach(addJob);
        });
    }
    console.log("Job scrape complete.");
}

