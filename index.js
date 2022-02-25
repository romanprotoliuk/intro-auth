const express = require('express');

// create an instance of express
const app = express();
const ejsLayouts = require('express-ejs-layouts');
require('dotenv').config(); // allows us to access env vars

app.set('view engine', 'ejs');
app.use(ejsLayouts);

app.get('/', (req, res) => {
	// send 'Hello, world' back to the client that made the request
	res.render('home.ejs');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log("You're listening to the smooth sounds of port 8000");
});
