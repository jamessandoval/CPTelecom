var express = require('express');
var router = express.Router();
var connection = require('../models/dbconnect');

router.get('/', function(req, res) {
    res.render('home', { message: req.flash('message') });
});

router.get('/employers', function(req, res) {
    res.render('employers');
});

router.post('/employers', function(req, res) {
    connection.pool.query('SELECT * FROM indeedJobs WHERE company LIKE ?', ['%' + req.body.search + '%'], function(err, rows, fields) {
        if (err) throw err;
        console.log(req.body.search);
        console.log(rows);

        var context = {};
        context.results = JSON.parse(JSON.stringify(rows));
        console.log(context.results);
        res.render('employers', {
            job: context.results
        });
    });
});

router.get('/reviews', function(req, res) {

    console.log(req.query.companyName);

    connection.pool.query('SELECT * FROM review WHERE company = ?', [req.query.companyName], function(err, rows) {
        if (err) throw err;
        connection.pool.query('SELECT avg(review.rating) AS avg FROM review WHERE company = ?', [req.query.companyName], function(err, rows2) {
            if (err) throw err;

            var context2 = {};
            var context = {};
            context.results = JSON.parse(JSON.stringify(rows));
            context.results2 = JSON.parse(JSON.stringify(rows2)); 
            console.log(context.results);
            res.render('reviews', {
                review: context.results,
                avg: context.results2
            });
        })
    });
});


module.exports = router;
