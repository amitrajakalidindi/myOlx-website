var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../configuration/dbConnection.js');
var nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
	res.render('signup',{
		username: req.cookies.user
	});
});

router.post('/', (req, res) => {
	var name = req.body.name;
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.pswd;
	function status(emailExist, usernameExist){
		if(emailExist){
			res.render('signup', {
				username: req.cookies.user,
				emailExist : true,
				usernameExist: false
			});
		}
		else if(usernameExist){
			res.render('signup', {
				username: req.cookies.user,
				emailExist : false,
				usernameExist: true
			});
		}
		else{
			var id = uuidv4();
			var query = `INSERT INTO users(name,username,email,password,id) VALUES('${name}','${username}','${email}',crypt('${password}',gen_salt('bf')),'${id}');`;
			db.query(query, (err, res) => {
				if(err){
					console.error(err);
					return;
				}
			});
			var transporter = nodemailer.createTransport({
				service: 'gmail',
			  	auth: {
			    	user: 'myolxservice@gmail.com',
			    	pass: 'myolxservice@1'
			  	}
			});

			var mailOptions = {
  				from: 'myolxservice@gmail.com',
  				to: `${email}`,
  				subject: 'Account Verification',
  				text: `Open link in browser to verify your account : http://afternoon-hollows-82984.herokuapp.com/userVerification/${id} `
			};
			transporter.sendMail(mailOptions, function(error, info){
			  	if (error) {
			    	console.log(error);
			  	}
			});
			res.render('verificationMessage',{
				email: email,
				username: req.cookies.user
			});
		}
	}
	var query = `SELECT email FROM users WHERE email='${email}';`;
	db.query(query, (err, res) => {
	    if (err) {
	        console.error(err);
	        return;
	    }
	    if(res.rows.length == 1){
	    	status(true,false);
	    }
	    else{
	    	query = `SELECT username FROM users WHERE username='${username}';`;
	    	db.query(query, (err, res) => {
			    if (err) {
			        console.error(err);
			        return;
			    }
			    if(res.rows.length == 1){
			    	status(false,true);
			    }
			    else{
			    	status(false,false);
			    }
			});
	    }
	});
});

module.exports = router;