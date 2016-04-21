// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

var User       = require('./models/user');
var Group      = require('./models/group');

var loginModule  = require('./routes/login_module');
var userModule   = require('./routes/user_module');
var groupModule  = require('./routes/group_module');
var systemModule = require('./routes/system_module');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Group2Goal');      // connect to our database

var port = process.env.PORT || 8080;        // set our port

// Allow CORS (cross-origin resource sharing)
// =============================================================================
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');


    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here
app.use('/', router);
app.use('/signup', loginModule.signup);
app.use('/signin', loginModule.signin);
app.use('/signout', loginModule.signout);
app.use('/creategroup', userModule.createGroup);
app.use('/joingroup', userModule.joinGroup);
// app.use('/:username/updategroup', userModule.updateGroup);
app.use('/deletegroup', userModule.deleteGroup);
app.use('/withdrawgroup', userModule.withdrawGroup);
app.use('/searchgroups', userModule.searchGroups);
app.use('/owngroups', userModule.ownGroups);
app.use('/joinedgroups', userModule.joinedGroups);
app.use('/listgroups', userModule.listGroups);
app.use('/getgmail', userModule.getGmail);
app.use('/getprofile', userModule.getProfile);
app.use('/updateprofile', userModule.updateProfile);
app.use('/listusers', groupModule.listUsers);
app.use('/showgroup', groupModule.showGroup);
app.use('/recommendgroups', systemModule.recommendGroups);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);