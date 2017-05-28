// jobs model

var connection = require('../models/dbconnect');


module.exports = function getJobs(job, callback){

	connection.query("SELECT * FROM job where title = ?", [id], function(err, rows) {
            done(err, rows[0]);
        });



}