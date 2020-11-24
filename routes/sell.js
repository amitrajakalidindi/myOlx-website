var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../configuration/dbConnection.js');
const { v4: uuidv4 } = require('uuid');
var multer  = require('multer')

var storage = multer.diskStorage({
  	destination: function (req, file, cb) {
	    cb(null, './public/classifiedImages');
	},
	filename: function (req, file, cb) {
		cb(null, 'classified-' + uuidv4() + '.' + file.mimetype.substring(file.mimetype.indexOf('/') + 1));
	}
})
var upload = multer({ storage: storage })

router.get('/', (req, res) => {
	if(req.cookies.user){
		function status(user){
			res.render('sell',{
				username: req.cookies.user,
				user : user
			});
		}
		var query = `SELECT * FROM users WHERE username='${req.cookies.user}';`
		db.query(query, (err, res) => {
			if(err){
		        console.error(err);
		        return;
		    }
		    else{
		    	status(res.rows[0]);
		    }
		});
	}
	else{
		res.redirect('/signin');
	}
});

router.post('/', upload.single('classifiedPhoto'),(req, res) => {
	var title = req.body.title;
	var price = req.body.price;
	var description = req.body.description;
	var id = req.file.filename.substr(req.file.filename.indexOf('-') + 1, 36);
	var ownerName = req.body.ownerName;
	var category = req.body.category;
	var mobileNumber = req.body.mobileNumber;
	var city = req.body.city;
	var state = req.body.state;
	var country = req.body.country;
	function status(isPosted){
		if(isPosted){
			res.redirect('/');
		}
	}
	if(!req.cookies.user){
		res.redirect('/signin');
	}
	else{
		var query = `INSERT INTO classified(title,price,description,owner,id,imagename,ownername,category,mobilenumber,city,state,country) VALUES('${title}','${price}','${description}','${req.cookies.user}','${id}','${req.file.filename}','${ownerName}','${category}','${mobileNumber}','${city}','${state}','${country}');`;
		db.query(query, (err, res) => {
			if(err){
		        console.error(err);
		        return;
		    }
		    else{
		    	status(true);
		    }
		});
	}
});

module.exports = router;