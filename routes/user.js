var express = require('express'),
router = express.Router(),
passport = require('passport'),
localStrategy = require('passport-local').Strategy,
session = require('express-session'),
database = require('../config/passport');


// login page
router.get('/login', function(req, res) {
	
	res.render('login');

});

router.get('/join', function(req, res) {
	req.flash('info', 'Flash is back!')
	res.render('join');
	
});

router.post('/join', passport.authenticate('local-signup', {

	successRedirect: '/',
	failureRedirect: '/user/login',
	failureFlash: true
	
}));

router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/',
	failureRedirect: '/user/login',
	failureFlash: true
	
}));

// Emxample route using authenticated
router.get('/forums', ensureAthenticated, function(req, res) {

	res.render('forums');

});


function ensureAthenticated(req, res, next){

	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/user/login');
	}

}


module.exports = router;