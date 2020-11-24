var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../configuration/dbConnection.js');

router.get('/', (req, res) => {
	var searchItem = req.query.searchItem.toLowerCase();
	function status(classifiedList){
		res.render('search',{
			username: req.cookies.user,
			searchItem: searchItem,
			classifiedList: classifiedList
		});
	}
	var query = `SELECT * FROM classified WHERE status='active' AND (LOWER(title) LIKE '%${searchItem}%' OR LOWER(category) LIKE '%${searchItem}%') ORDER BY postingdate DESC;`;
	db.query(query, (err, res) => {
		if(err){
	        console.error(err);
	        return;
	    }
	    else{
	    	status(res.rows);
	    }
	});
})

router.post('/', (req, res) => {
	var searchItem = req.query.searchItem.toLowerCase();
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
		res.render('search',{
			username: req.cookies.user,
			searchItem: searchItem,
			classifiedList: classifiedList
		});
	}
	var query = `SELECT * FROM classified WHERE status='active' AND (LOWER(title) LIKE '%${searchItem}%' OR LOWER(category) LIKE '%${searchItem}%')`;
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