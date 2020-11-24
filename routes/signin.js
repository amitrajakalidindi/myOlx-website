var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../configuration/dbConnection.js');

router.get('/', (req, res) => {
	res.render('signin',{
		username: req.cookies.user
	});
});

router.post('/', (req, res) => {
	var email = req.body.siemail;
	var password = req.body.sipswd;
	var username;
	var query = `SELECT username FROM users WHERE email='${email}' and password=crypt('${password}', password) and status='verified';`;
	function status(userExist){
		if(userExist){
			req.cookies.user = username;
			res.cookie('user', username);
			res.redirect('/');
		}
		else{
			res.render('signin',{
				username: req.cookies.user,
				loginFailed : true
			})
		}
	}
	db.query(query, (err, res) => {
		if (err) {
	        console.error(err);
	        return;
	    }
	    else{
	    	if(res.rows.length){
	    		username = res.rows[0].username;
	    		status(true);
	    	}
	    	else{
	    		status(false);
	    	}
	    }
	});


});

module.exports = router;