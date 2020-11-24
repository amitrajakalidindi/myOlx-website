var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../configuration/dbConnection.js');

router.get('/', (req, res) => {
	var count = 0;
	var newlyAddedList;
	var mobilesList;
	var bikesList;
	var carsList;
	var booksList;
	var electronicAppliancesList;
	var othersList;
	function status(category, List){
		count++;
		if(category == 'newlyAdded'){
			newlyAddedList = List;
		}
		else if(category == 'Mobiles'){
			mobilesList = List;
		}
		else if(category == 'Bikes'){
			bikesList = List;
		}
		else if(category == 'Cars'){
			carsList = List;
		}
		else if(category == 'Electronics&Appliances'){
			electronicAppliancesList = List;
		}
		else if(category == 'Books'){
			booksList = List;
		}
		else if(category == 'Others'){
			othersList = List;
		}
		if(count == 7){
			res.render('home',{
				username: req.cookies.user,
				newlyAddedList: newlyAddedList,
				mobilesList: mobilesList,
				bikesList: bikesList,
				carsList: carsList,
				electronicAppliancesList: electronicAppliancesList,
				booksList: booksList,
				othersList: othersList
			});
		}
	}
	var query1 = `SELECT * FROM classified WHERE status='active' ORDER BY postingdate DESC LIMIT 6`;
	db.query(query1, (err, res) => {
		if(err){
	        console.error(err);
	        return;
	    }
	    else{
	    	status('newlyAdded', res.rows);
	    }
	});
	var query2 = `SELECT * FROM classified WHERE category='Mobiles' and status='active' ORDER BY postingdate DESC LIMIT 6`;
	db.query(query2, (err, res) => {
		if(err){
	        console.error(err);
	        return;
	    }
	    else{
	    	status('Mobiles', res.rows);
	    }
	});
	var query3 = `SELECT * FROM classified WHERE category='Bikes' and status='active' ORDER BY postingdate DESC LIMIT 6`;
	db.query(query3, (err, res) => {
		if(err){
	        console.error(err);
	        return;
	    }
	    else{
	    	status('Bikes', res.rows);
	    }
	});
	var query4 = `SELECT * FROM classified WHERE category='Cars' and status='active' ORDER BY postingdate DESC LIMIT 6`;
	db.query(query4, (err, res) => {
		if(err){
	        console.error(err);
	        return;
	    }
	    else{
	    	status('Cars', res.rows);
	    }
	});
	var query5 = `SELECT * FROM classified WHERE category='Electronics&Appliances' and status='active' ORDER BY postingdate DESC LIMIT 6`;
	db.query(query5, (err, res) => {
		if(err){
	        console.error(err);
	        return;
	    }
	    else{
	    	status('Electronics&Appliances', res.rows);
	    }
	});
	var query6 = `SELECT * FROM classified WHERE category='Books' and status='active' ORDER BY postingdate DESC LIMIT 6`;
	db.query(query6, (err, res) => {
		if(err){
	        console.error(err);
	        return;
	    }
	    else{
	    	status('Books', res.rows);
	    }
	});
	var query7 = `SELECT * FROM classified WHERE category='Others' and status='active' ORDER BY postingdate DESC LIMIT 6`;
	db.query(query7, (err, res) => {
		if(err){
	        console.error(err);
	        return;
	    }
	    else{
	    	status('Others', res.rows);
	    }
	});
})
module.exports = router;