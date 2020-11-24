const express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var home = require('./routes/home.js');
var signin = require('./routes/signin.js');
var signup = require('./routes/signup.js');
var logout = require('./routes/logout.js');
var user = require('./routes/user.js');
var sell = require('./routes/sell.js');
var classified = require('./routes/classified.js');
var category = require('./routes/category.js');
var search = require('./routes/search.js');
var userVerification = require('./routes/userVerification.js');


var app = express();

app.set('view engine', 'pug');
app.set('views','./views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'ssshhhhh'}));
app.use(express.static('public/classifiedImages'));

app.use('/', home);
app.use('/signin', signin);
app.use('/signup', signup);
app.use('/logout', logout);
app.use('/user/', user);
app.use('/sell', sell);
app.use('/classified/',classified);
app.use('/category/',category);
app.use('/search', search);
app.use('/userVerification/',userVerification);

app.get('/db', async (req, res) => {
    try {
	    const client = await pool.connect();
	    const result = await client.query('SELECT * FROM test_table');
	    const results = { 'results': (result) ? result.rows : null};
	    res.render('pages/db', results );
	    client.release();
    } catch (err) {
      	console.error(err);
      	res.send("Error " + err);
    }
});


app.listen(process.env.PORT || 5000);