var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../configuration/dbConnection.js');

router.get('/:id', (req, res) => {
	var query = `UPDATE users SET status='verified' WHERE id='${req.params.id}';`;
	function status(){
		res.redirect('/signin');
	}
	db.query(query, (err, res) => {
		if (err) {
	        console.error(err);
	        return;
	    }
	    else{
	    	status();
	    }
	});


});

module.exports = router;