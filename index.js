const cookieParser = require('cookie-parser');
const express = require('express');

// create an instance of express
const app = express();
const ejsLayouts = require('express-ejs-layouts');
require('dotenv').config(); // allows us to access env vars
const cryptoJS = require('crypto-js');
const db = require('./models');

// MIDDLEWARE
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(cookieParser()); // gives us access to req.cookies
app.use(express.urlencoded({ extended: false })); // body parser makes req.body work

// CUSTOM LOGIN MIDDLEWARE
app.use(async (req, res, next) => {
	if (req.cookies.userId) {
		// decrypting the incoming user id from the cookie
		const decryptedId = cryptoJS.AES.decrypt(req.cookies.userId, process.env.SECRET);
		// converting the decrypted id into a readable string
		const decryptedIdString = decryptedId.toString(cryptoJS.enc.Utf8);
		// querying the db for the user with that id
		const user = await db.user.findByPk(decryptedIdString);
		// assigning the found user to res.locals.user in the routes, and user in the ejs
		res.locals.user = user;
	} else res.locals.user = null;
	next(); // move on to next middleware
});

app.use('/users', require('./controllers/user'));
app.get('/', (req, res) => {
	// send 'Hello, world' back to the client that made the request
	res.render('home.ejs');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log("You're listening to the smooth sounds of port 8000");
});
