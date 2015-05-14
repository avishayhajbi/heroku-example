var express = require('express');
var path = require('path');
var bodyParser  = require('body-parser');
var fs = require("fs-extra");
var app = express();
Db = require('mongodb').Db,
  MongoClient = require('mongodb').MongoClient;

//--------------------------------Connect to mongodb using Mongoose--------------------------------//
var mongoose = require('mongoose');
//--------------------------------Connect to mongodb using Mongoose--------------------------------//

app.use(express.static(path.join(__dirname ,'views')));
app.use(bodyParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var port = process.env.PORT || 8080;
app.set('port', port);

config = {
  mongoUrl:"mongodb://<user>:<pass>@ds061747.mongolab.com:61747/<db name>"
};
//--------------------------------Connect to mongodb using Mongoose--------------------------------//
//The server option auto_reconnect is defaulted to true
var options = {
    db: { native_parser : true , upsert: true},
    server: { poolSize: 5 }
};

var connect = function () 
{
  console.log('Mongoose: Trying to establish connection.');
  //For long running applictions it is often prudent to enable keepAlive. 
  //Without it, after some period of time you may start to see "connection closed" errors for what seems like no reason.
  //options.server.socketOptions = options.replset.socketOptions = { keepAlive : true };
  options.server.socketOptions = { keepAlive : true, connectTimeoutMS : 30000 };
  
  mongoose.connect(config.mongoUrl, options);
};

// make global connection variable
db = mongoose.connection;

// create event handlers for Mongoose
db.on('error', function (err)
{
  console.log('Mongoose: Error: ' + err);
});

db.on('open', function() 
{
  console.log('Mongoose: Connection established.');
});

db.on('disconnected', function()
{
  console.log('Mongoose: Connection stopped, recconect.');
  connect();
});


// connect to MongoLab using Mongoose
//connect();
//--------------------------------Connect to mongodb using Mongoose--------------------------------//

app.listen(app.get('port'), function() 
{
    console.log('Server running...' + app.get('port'));
});

app.get('/', function(req, res) 
{
    res.send(202,'welcome');
});

app.get('/mongodb', function(req, res) 
{
  MongoClient.connect(config.mongoUrl, { native_parser:true }, function(err, db)
  {
    var r = {};
    console.log("Trying to connect to the db.");             
    // if connection failed
    if (err) 
    {
      console.log("MongoLab connection error: ", err);
      r.desc = "failed to connect to MongoLab.";
      res.json(r);
      db.close();
      return;
    }

    // get sessions collection 
    var collection = db.collection('test');              
    collection.find( { } ).toArray(function (err, docs)
    { 
      // failure while connecting to sessions collection
      if (err) 
      {
        console.log("failure while trying close session, the error: ", err);
        r.desc = "failure while trying update session.";
        res.json(r);
        db.close();
        return;
      }
      else 
      {
        console.log("the data: ",docs);
        r.desc = "success";
        r.data = docs;
        res.json(r);
        db.close(); 
        return;
      }   
    });
  });   
});

app.get('/mongoose', function(req, res) 
{
  db.model('test').find({ }, function (err, result){
    if (err) res.send(0);
    else res.send(result);
  });
});

app.get('/*', function(req, res) 
{
  res.send(405,'page not allowed icook');
});