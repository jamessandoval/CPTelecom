var express = require('express');
router = express.Router();

router.get('/', function(req, res){
	req.flash('info', 'Flash is back!')
	res.render('home');

})

module.exports = router;