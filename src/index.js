const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const PORT = process.env.PORT || 5001;

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

require('./controllers/authController')(app);
require('./controllers/customerController')(app);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});