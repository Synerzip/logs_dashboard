var app, dist, express, http, path, server, bodyParser;
express = require("express");
http = require('http');
path = require("path");
bodyParser = require('body-parser');
require('dotenv').config();

dist = path.join(__dirname, './dist');
app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Authenticate user based on username & password
app.post('/login/',function(req,res){
  
console.log('login action');

console.log(req.body);
console.log(req.body.username);
if (req.body.username == process.env.AUTH_USERNAME && req.body.password == process.env.AUTH_PASSWORD) {
    res.status(200).json({success: true});
    console.log('success');
  } else {
    res.status(401).json({success: false});
    console.log('fail');
  }
});

// Basic Authentication added on top of express server
app.use(function(req, res, next){
  var auth;
//var fullUrl = req.protocol + '://' +req.headers.authorization+ req.get('host') + req.originalUrl;
console.log('basic auth loaded');  
if (req.headers.authorization) {
    auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
  }
  console.log(auth);
  if (!auth || auth[0] !== process.env.AUTH_USERNAME || auth[1] !== process.env.AUTH_PASSWORD) {
    console.log("inside if condition" );
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="logs-dashboard"');
    res.end("You're not authorized to access this page!");
  } else {
    console.log("inside else condition" );
    next();
  }
});
app.use(express["static"](dist));
app.set("port", process.env.PORT);
var AWS = require('aws-sdk');
AWS.config.update({region:'us-west-2'});
var cloudwatchlogs = new AWS.CloudWatchLogs();

var filterLogEventsParams = {
    interleaved: true,
    logGroupName: 'US-QA', /* required */
    filterPattern: '',
    startTime:null,
    limit: 3,
    logStreamNames: [
      'tomcat'
    ],
    nextToken:null
};

cloudwatchlogs.filterLogEvents(filterLogEventsParams, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log("filterLogEventsParams", data); // successful response
});

app.get('/getFilterLogEvents/',function(req,res){
  var filterLogEventsParams=req.headers['filterlogeventsparams'];
  cloudwatchlogs.filterLogEvents(JSON.parse(filterLogEventsParams), function(err,data) {
    if (err)
      console.log(err, err.stack); // an error occurred
    else {
      console.log("filterLogEventsParams",data);
      res.status(200).json(data)
    }// successful response
  });
});

app.get('/getLogEvents/',function(req,res){
  var logeventsparam=req.headers['logeventsparam'];
  cloudwatchlogs.getLogEvents(JSON.parse(logeventsparam), function(err,data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      console.log(data);
      res.status(200).json(data)
    }// successful response
  });
});

app.get('/getGroups/',function(req,res){
  console.log("inside getGroups");
  res.status(200)
    .json({groups: ['US-QA']});
});

app.get('/getStreams/',function(req,res){
  res.status(200)
    .json({streams: ['tomcat']});
});

server = http.createServer(app);

server.listen(app.get("port"), function() {
  return console.log("Express server listening on port Test " + server.address().port);
});
