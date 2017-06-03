var connection = require('../models/dbconnect.js'),
    request = require('request');

//John's API Key for Indeed.com and our max scraping number
var indeedAPI = "2648850467422389";

function createIndeedTable() {
    // drop if exists first
    connection.pool.query("DROP TABLE IF EXISTS indeedJobs", function(err, result) {
        if (err) throw err;
        var createString = "CREATE TABLE indeedJobs(" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "jobTitle VARCHAR(255) NOT NULL," +
            "company VARCHAR(255) NOT NULL," +
            "daysAgo VARCHAR(255) NOT NULL," +
            "url TEXT NOT NULL, " +
            "snippet TEXT NOT NULL, " +
            "date_scraped timestamp NOT NULL, " +
            "jobkey VARCHAR(255) UNIQUE KEY," +
            "rating INT)";
        connection.pool.query(createString, function(err) {
            if (err) throw err;
        });
    });
}

function jobComplete() {
    connection.pool.query("SELECT * FROM indeedJobs", function(err, result) {
        if (err) throw err;

        console.log("job scrape complete " + result.length + " entries inserted.");
    })    
}

module.exports = function() {
    // global variables
    createIndeedTable();
    startJob = 0;


    // Initial Api Call to get total results
    var url = "http://api.indeed.com/ads/apisearch?publisher=" + indeedAPI + "&format=json&l=remote&sort=date&radius=&st=&jt=&start=" + startJob + "&limit=" + 25 + "&fromage=&filter=1&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2";
    request.get(url, function(error, res, ret) {
        if (!ret) {
            console.log("empty response");
            return null;
        }

        var jobs = {};
        var jobAdd = 0;
        jobs = JSON.parse(ret);
        //console.log("job results = " + jobs.totalResults)
        while (startJob < jobs.totalResults) {
            var url = "http://api.indeed.com/ads/apisearch?publisher=" + indeedAPI + "&format=json&l=remote&sort=date&radius=&st=&jt=&start=" + startJob + "&limit=25&fromage=&filter=1&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2";
            request.get(url, function(error, res, ret) {
                if (error) return;
                if (!ret) return null;

                var jobs = {};
                jobs = JSON.parse(ret);
                for (var i = 0; i < 25; i++) {

                    connection.pool.query("REPLACE INTO indeedJobs(jobkey, jobTitle, company, daysAgo, url, snippet) VALUES (?, ?, ?, ?, ?, ?)", [jobs.results[i].jobkey, jobs.results[i].jobtitle, jobs.results[i].company, jobs.results[i].formattedRelativeTime, jobs.results[i].url, jobs.results[i].snippet], function(err, rows, fields) {
                        if (err) {
                            throw err;
                        } else {
                            // console.log(rows.affectedRows);
                            if (rows.affectedRows == 1) {
                                jobAdd++;
                                //console.log("added.");
                            }
                        }
                    })
                }
            });
            startJob = startJob + 25;
        }
        console.log("job scrape in progress...");
        setTimeout(jobComplete, 10000)
    });

};
