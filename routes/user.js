var express = require('express'),
router = express.Router(),
passport = require('passport'),
localStrategy = require('passport-local').Strategy,
session = require('express-session'),
database = require('../config/passport');


// login page
router.get('/login', function(req, res) {
	res.render('login', {message: req.flash('message')});
});

router.get('/logout', function(req, res) {
	req.logout();
	req.flash('message', 'You are logged out');
	res.redirect('/')
	
});

router.get('/join', function(req, res) {
	res.render('join', {message: req.flash('message')});
});

router.post('/join', passport.authenticate('local-signup', {	
	successRedirect: '/',
	failureRedirect: '/user/join',
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
};

module.exports = router;
