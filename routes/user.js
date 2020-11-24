var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../configuration/dbConnection.js');
var fs = require('fs');

router.get('/:username', (req, res) => {
	var cityExist = false;
	var stateExist = false;
	var countryExist = false;
	var mobileNumberExist = false;
	if(req.params.username == req.cookies.user){
		function status(userDetails){
			if(userDetails.city != null){
				cityExist = true;
			}
			if(userDetails.state != null){
				stateExist = true;
			}
			if(userDetails.country != null){
				countryExist = true;
			}
			if(userDetails.mobilenumber != null){
				mobileNumberExist = true;
			}
			res.render('user',{
				username: req.cookies.user,
				user: userDetails,
				mobileNumberExist: mobileNumberExist,
				cityExist: cityExist,
				stateExist: stateExist,
				countryExist: countryExist
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
		res.send(`<html><body><h1>You are not authorized to access this page</h1></body></html>`);
	}
});

router.post('/:username', (req, res) => {
	var name = req.body.name;
	var email = req.body.email;
	var queryCount = 1;
	if(req.body.mobileNumber){
		var mobileNumber = req.body.mobileNumber;
	}
	else{
		var mobileNumber = null;
		queryCount++;
	}
	if(req.body.city){
		var city = req.body.city;
	}
	else{
		var city = null;
		queryCount++;
	}
	if(req.body.state){
		var state = req.body.state;
	}
	else{
		var state = null;
		queryCount++;
	}
	if(req.body.country){
		var country = req.body.country;
	}
	else{
		var country = null;
		queryCount++;
	}
	function status(){
		queryCount--;
		if(queryCount == 0){
			res.redirect(`/user/${req.cookies.user}`);
		}
	}
	var query = `UPDATE users SET name='${name}',email='${email}',mobilenumber='${mobileNumber}',city='${city}',state='${state}',country='${country}' WHERE username='${req.cookies.user}';`;
	db.query(query, (err, res) => {
		if(err){
	        console.error(err);
	        return;
	    }
	    status();
	});
	if(!mobileNumber){
		var query1 = `UPDATE users SET mobilenumber=null WHERE username='${req.cookies.user}';`;
		db.query(query1, (err, res) => {
			if(err){
		        console.error(err);
		        return;
		    }
		    status();
		});
	}
	if(!city){
		var query2 = `UPDATE users SET city=null WHERE username='${req.cookies.user}';`;
		db.query(query2, (err, res) => {
			if(err){
		        console.error(err);
		        return;
		    }
		    status();
		});	
	}
	if(!state){
		var query3 = `UPDATE users SET state=null WHERE username='${req.cookies.user}';`;
		db.query(query3, (err, res) => {
			if(err){
		        console.error(err);
		        return;
		    }
		    status();
		});
	}
	if(!country){
		var query4 = `UPDATE users SET country=null WHERE username='${req.cookies.user}';`;
		db.query(query4, (err, res) => {
			if(err){
		        console.error(err);
		        return;
		    }
		    status();
		});
	}

});

router.get('/:username/classifieds', (req, res) => {
	if(req.params.username == req.cookies.user){
		var activeList;
		var closedList;
		var count = 0;
		function status(classifiedsStatus, classifiedList){
			count++;
			if(classifiedsStatus == 'active'){
				activeList = classifiedList;
			}
			if(classifiedsStatus == 'closed'){
				closedList = classifiedList;
			}
			if(count == 2){
				res.render('userClassifieds',{
					username: req.cookies.user,
					activeList: activeList,
					closedList: closedList
				});
			}
		}
		var query1 = `SELECT * FROM classified WHERE status='active' and owner='${req.cookies.user}';`;
		db.query(query1, (err, res) => {
			if(err){
		        console.error(err);
		        return;
		    }
		    status('active',res.rows);
		});
		var query2 = `SELECT * FROM classified WHERE status='closed' and owner='${req.cookies.user}';`;
		db.query(query2, (err, res) => {
			if(err){
		        console.error(err);
		        return;
		    }
		    status('closed',res.rows);
		});
	}
	else{
		res.send(`<html><body><h1>You are not authorized to access this page</h1></body></html>`);
	}
});

router.get('/:username/classifieds/:id', (req, res) => {
	if(req.params.username == req.cookies.user){
		var query = `SELECT *,EXTRACT(DAY FROM now() - postingdate) AS timedifference FROM classified WHERE id='${req.params.id}';`;
		function status(isClassifiedExist, classified){
			if(!isClassifiedExist){
				res.redirect('/classifiedDoesNotExist');
			}
			else{
				var classifiedAge;
				if(classified.timedifference == 0){
					classifiedAge = 'today';
				}
				else if(classified.timedifference == 1){
					classifiedAge = 'yesterday';
				}
				else if(classified.timedifference < 30){
					classifiedAge = `${classified.timedifference} days ago`;
				}
				else if(classified.timedifference < 365){
					classifiedAge = `${classified.timedifference/30} months ago`
				}
				else{
					classifiedAge = `${classified.timedifference/365} years ago`
				}
				res.render('userClassified',{
					username: req.cookies.user,
					classified: classified,
					classifiedAge: classifiedAge
				});
			}
		}
		db.query(query, (err, res) => {
			if(err){
		        console.error(err);
		        return;
		    }
		    else{
		    	if(!res.rows.length){
		    		status(false,null);
		    	}
		    	else{
		    		status(true,res.rows[0]);
		    	}
		    }
		});
	}
	else{
		res.send(`<html><body><h1>You are not authorized to access this page</h1></body></html>`);
	}
});

router.get('/:username/classifieds/:id/:action', (req, res) => {
	if(req.params.username == req.cookies.user){
		if(req.params.action == 'close'){
			function status(){
				res.redirect(`/user/${req.cookies.user}/classifieds`)
			}
			var query = `UPDATE classified SET status='closed' WHERE id='${req.params.id}';`;
			db.query(query, (err, res) => {
				if(err){
			        console.error(err);
			        return;
			    }
			    status();
			});
		}
		else if(req.params.action == 'reopen'){
			function status(){
				res.redirect(`/user/${req.cookies.user}/classifieds`)
			}
			var query = `UPDATE classified SET status='active' WHERE id='${req.params.id}';`;
			db.query(query, (err, res) => {
				if(err){
			        console.error(err);
			        return;
			    }
			    status();
			});
		}
		else if(req.params.action == 'delete'){
			var imagename;
			function status(){
				res.redirect(`/user/${req.cookies.user}/classifieds`);
				fs.unlink(`./public/classifiedImages/${imagename}`,(err) => {
					if(err) console.log(err);
				});
			}
			var query1 = `SELECT imagename from classified WHERE id='${req.params.id}';`;
			db.query(query1, (err, res) => {
				if(err){
			        console.error(err);
			        return;
			    }
			    imagename = res.rows[0].imagename;
			});
			var query2 = `DELETE FROM classified WHERE id='${req.params.id}';`;
			db.query(query2, (err, res) => {
				if(err){
			        console.error(err);
			        return;
			    }
			    status();
			});
		}
		else if(req.params.action == 'modify'){
			function status(classified){
				res.render('classifiedModification', {
					username: req.cookies.user,
					classified: classified
				});
			}
			query = `SELECT * FROM classified WHERE id='${req.params.id}';`;
			db.query(query, (err, res) => {
				if(err){
			        console.error(err);
			        return;
			    }
			    status(res.rows[0]);
			});
		}
	}
	else{
		res.send(`<html><body><h1>You are not authorized to access this page</h1></body></html>`);		
	}
});

router.post('/:username/classifieds/:id/modify', (req, res) => {
	if(req.params.username == req.cookies.user){
		var title = req.body.title;
		var price = req.body.price;
		var description = req.body.description;
		var id = req.params.id;
		var ownerName = req.body.ownerName;
		var category = req.body.category;
		var mobileNumber = req.body.mobileNumber;
		var city = req.body.city;
		var state = req.body.state;
		var country = req.body.country;
		function status(){
			res.redirect(`/user/${req.cookies.user}/classifieds/${req.params.id}`);
		}
		query = `UPDATE classified SET title='${title}',price='${price}',description='${description}',ownername='${ownerName}',category='${category}',mobilenumber='${mobileNumber}',city='${city}',state='${state}',country='${country}' WHERE id='${id}';`;
		db.query(query, (err, res) => {
			if(err){
		        console.error(err);
		        return;
		    }
		    else{
		    	status();
		    }
		});
	}
	else{
		res.send(`<html><body><h1>You are not authorized to access this page</h1></body></html>`);
	}
});

router.get('/:username/settings', (req, res) => {
	if(req.params.username == req.cookies.user){
		res.render('userSettings',{
			username: req.cookies.user,
		});
	}
	else{
		res.send(`<html><body><h1>You are not authorized to access this page</h1></body></html>`);
	}
});

router.post('/:username/settings', (req, res) => {
	if(req.params.username == req.cookies.user){
		var oldPassword = req.body.oldPassword;
		var newPassword = req.body.newPassword;
		var confirmPassword = req.body.confirmPassword;
		function status(requestStatus,wrongPassword){
			if(requestStatus){
				res.redirect('/');
			}
			else{
				if(wrongPassword){
					res.render('userSettings',{
						username: req.cookies.user,
						wrongPassword: true
					});
				}
				else{
					res.render('userSettings',{
						username: req.cookies.user,
						requestFailed: true
					});
				}
			}
		}
		var query = `SELECT * FROM users WHERE username='${req.cookies.user}' AND password=crypt('${oldPassword}', password);`;
		db.query(query, (err, res) => {
			if(err){
				console.error(err);
				return;
			}
			else{
				if(res.rows.length == 1){
					if(newPassword != confirmPassword){
						status(false, false);
					}
					else{
						var query = `UPDATE users SET password=crypt('${newPassword}',gen_salt('bf')) WHERE username='${req.cookies.user}';`;
						db.query(query, (err, res) => {
							if(err){
								console.error(err);
								return;
							}
							else{
								status(true, true);
							}
						});
					}
				}
				else{
					status(false, true);
				}
			}
		});
	}
	else{
		res.send(`<html><body><h1>You are not authorized to access this page</h1></body></html>`);
	}
});

module.exports = router;