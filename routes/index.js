var express = require('express');
var router = express.Router();
var connection = require('../models/dbconnect');


router.get('/', function(req, res) {
    res.render('home', { message: req.flash('message') });
});

router.get('/employers', function(req, res) {

    connection.query('SELECT * FROM job', function(err, rows, fields) {

            var context = {};
            context.results = JSON.parse(JSON.stringify(rows));
            console.log(context.results);
            res.render('employers', {
                    job: context.results
            });
    });
});


module.exports = router;
