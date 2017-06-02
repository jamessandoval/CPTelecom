var connection = require('../models/dbconnect.js'),
    request = require('request');

//John's API Key for Indeed.com and our max scraping number
var indeedAPI = "2648850467422389";
// cannot exceed 25 per page
var jobsPerPage = 25;
var totalJobs = 10000;

function createIndeedTable() {
    var createString = "CREATE TABLE indeedJobs(" +
        "id INT PRIMARY KEY AUTO_INCREMENT," +
        "jobTitle VARCHAR(255) NOT NULL," +
        "company VARCHAR(255) NOT NULL," +
        "daysAgo VARCHAR(255) NOT NULL," +
        "url TEXT NOT NULL, " +
        "snippet TEXT NOT NULL, " +
        "date_scraped timestamp NOT NULL, " +
        "jobkey VARCHAR(255)," + 
        "rating INT)";
    connection.pool.query(createString, function(err) {
        if (err)
            throw err;
    });
}
// check to see if item is a duplicate.
function addJob(item, index) {
    console.log(index);
    console.log(item);
    connection.pool.query("SELECT * FROM indeedJobs WHERE jobkey = ?", [item.jobkey], function(err, rows) {
        if (err) {
            throw err;
        }else if (rows.length > 1) {
            console.log("duplicate entry found.");
            return;
        } else {
            connection.pool.query("INSERT INTO indeedJobs (jobkey, jobTitle, company, daysAgo, url, snippet) VALUES (?, ?, ?, ?, ?, ?)", [item.jobkey,item.jobtitle, item.company, item.formattedRelativeTime, item.url, item.snippet], function(err) {
                if (err) {
                    throw err;
                } else {
                    //console.log("successfully added");
                }
            });
        }
    });
};

module.exports = function() {

    console.log("job scrape in progress. Evaulating " + totalJobs + " entries");

    var startJob = 0;
    connection.pool.query("DROP TABLE IF EXISTS indeedJobs", function(err, result) {
        if (err)
            throw err;
        else {
            createIndeedTable();
            while (startJob <= (totalJobs)) {
                var url = "http://api.indeed.com/ads/apisearch?publisher=" + indeedAPI + "&format=json&l=remote&sort=date&radius=&st=&jt=&start=" + startJob + "&limit=" + jobsPerPage + "&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2";
                startJob += 25;
                request.get(url, function(error, res, ret) {
                    // if no ret response
                    
                    if (!ret) {
                        return;
                    }
                    var jobs = JSON.parse(ret);
                    jobs.results.forEach(addJob);
                    //totalJobs = jobs.totalResults;
                    console.log(totalJobs);
                });
            }
            return;

        }

    });


}
