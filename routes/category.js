var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../configuration/dbConnection.js');

router.get('/:category', (req, res) => {
	function status(classifiedList){
		res.render('category',{
			username: req.cookies.user,
			categoryName: req.params.category,
			classifiedList: classifiedList
		});
	}
	var query;
	if(req.params.category == 'newlyAdded'){
		query = `SELECT * FROM classified WHERE status='active' ORDER BY postingdate DESC;`
	}
	else{
		query = `SELECT * FROM classified WHERE category='${req.params.category}' and status='active' ORDER BY postingdate DESC;`
	}
	db.query(query, (err, res) => {
		if(err){
	        console.error(err);
	        return;
	    }
	    else{
	    	status(res.rows);
	    }
	});
});

router.post('/:category', (req, res) => {
	var city = req.body.city.toLowerCase();
	var state = req.body.state.toLowerCase();
	var country = req.body.country.toLowerCase();
	var minPrice; 
	if(req.body.minprice){
		minPrice = parseInt(req.body.minprice);
	}
	var maxPrice;
	if(req.body.maxprice){
		maxPrice = parseInt(req.body.maxprice);
	}
	if(minPrice && maxPrice && minPrice > maxPrice){
		var temp = minPrice;
		minPrice = maxPrice;
		maxPrice = temp;
	}
	function status(classifiedList){
		res.render('category',{
			username: req.cookies.user,
			categoryName: req.params.category,
			classifiedList: classifiedList
		});
	}
	var query = `SELECT * FROM classified WHERE status='active'`;
	if(city){
		query = query + ` AND LOWER(city)='${city}'`;
	}
	if(state){
		query = query + ` AND LOWER(state)='${state}'`;
	}
	if(country){
		query = query + ` AND LOWER(country)='${country}'`;
	}
	if(minPrice){
		query = query + ` AND price>='${minPrice}'`;
	}
	if(maxPrice){
		query = query + ` AND price<='${maxPrice}'`;
	}
	query = query + ` ORDER BY postingdate DESC;`;
	db.query(query, (err, res) => {
		if(err){
	        console.error(err);
	        return;
	    }
	    else{
	    	status(res.rows);
	    }
	});
});

module.exports = router;