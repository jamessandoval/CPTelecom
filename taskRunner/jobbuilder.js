//var request = require('request');
//var cheerio = require('cheerio');
var indeed = require('indeed-scraper');
var connection = require('../models/dbconnect');

queryOptions = {
    query: 'Telecommute',
    city: '',
    radius: '',
    level: '',
    jobType: '',
    maxAge: '',
    sort: 'date',
    limit: ''
};

console.log("jobs being built");

indeed.query(queryOptions).then(res => {
    console.log(res); // An array of Job objects
    console.log("Total number of jobs being evaluated:" + queryOptions.limit);
    res.forEach(addJob);
    

});

function addJob(item, index) {

    console.log(index);
    console.log(item);

    var dupCount = 0;
    var addCount = 0;

    connection.query("SELECT * FROM job WHERE title = ? AND summary = ? AND url = ?", [item.title, item.summary, item.url], function(err, rows) {
        if (err) {
            throw err;
        }

        if (rows.length) {
            console.log("duplicate found, not copying");
            addCount++;
            return;
        } else {

            item.company = item.company || "None";
            connection.query("INSERT INTO job ( title, summary, url, company, location, date_posted ) values (?,?,?,?,?,?)", [item.title, item.summary, item.url, item.company, item.location, item.postDate], function(err) {
                if (err) {
                    throw err;
                } else {
                    dupCount++;
                    console.log("successfully added.");
                }
            });
        }

    });

};



