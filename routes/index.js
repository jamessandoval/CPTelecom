var express = require('express');
router = express.Router();

router.get('/', function(req, res){
	res.render('home', {message: req.flash('message')});
});

module.exports = router;
