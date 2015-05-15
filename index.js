var express = require('express');
var path = require('path');
var bodyParser  = require('body-parser');
var fs = require("fs-extra");
var app = express();
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
    var collection = db.collection('users');              
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