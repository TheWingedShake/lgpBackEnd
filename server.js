const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const session = require('express-session');
const db = require('./config/db');
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');

const port = 8000;

const originsWhitelist = [
  'http://localhost:4200'
];
const corsOptions = {
  origin: originsWhitelist,
  credentials:true
}

mongoose.connect(db.url, { autoIndex: false });

app.use(bodyParser.json());

app.use(cors(corsOptions));

app.use(cookieParser('logplanner'));

app.use(session({
  secret: 'logplanner',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: false,
    maxAge: 36000000,
    expires: 3600000 * 24 * 14
  },
  store: new mongoStore({mongooseConnection: mongoose.connection})
}));

app.use(function(req, res, next){
  if (req.method === "OPTIONS") {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
  } else {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
}});

require('./app/routes')(app);
app.listen(port, () => {
  console.log('We are live on ' + port);
});
