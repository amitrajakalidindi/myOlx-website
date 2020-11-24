var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../configuration/dbConnection.js');

router.get('/:id', (req, res) => {
	var query = `SELECT *,EXTRACT(DAY FROM now() - postingdate) AS timedifference FROM classified WHERE id='${req.params.id}' and status='active';`
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
			res.render('classified',{
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
});

module.exports = router;