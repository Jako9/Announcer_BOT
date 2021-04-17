const express = require('express')
const session = require('express-session');
const request = require('request');
const moment = require('moment');

const dbManager = require('./managers/databaseManager');

const formidableMiddleware = require('formidable');
const bcrypt = require('bcryptjs');

const fs = require('fs');
const path = require('path');
const onlineManager = require('./managers/onlineManager');

const app = express()
const port = 80

app.set('view engine','ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + "/pages");

app.use('/style/', express.static(__dirname + '/style/'));

const formidableCache = {
  encoding: 'utf-8',
  uploadDir: path.join(__dirname, 'uploads' , '.cache'),
  multiples: true, // req.files to be arrays of files
  keepExtensions: true
};

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.get('/', (req, res) => {
  dbManager.getStatistics().then((content) => {
    let statistics = formatStatistics(JSON.parse(content));

    onlineManager.getOnlineStatus().then((status) => {
      let online = formatOnline(status.data);

      res.render("main", {
        "statistics": statistics,
        "online": online
      });
    })
  }).catch(function(error) {
    console.log(error);
    res.send("uff");
 })
  
})

app.listen(port, () => {
  console.log("Launching webserver...");
})

function formatStatistics(statistics){
  let timeInMillisecs = statistics.totalPlaytime;
  let tempTime = moment.duration(timeInMillisecs);

  statistics.totalPlaytime = tempTime.days() + tempTime.hours() + ":" + tempTime.minutes() + ":" + tempTime.seconds();

  return statistics;
}

function formatOnline(onlineStatus){
  let hstatus = (onlineStatus == 1);

  let obj = {};

  obj.text = (hstatus)? "Online" : "Offline";
  obj.color = (hstatus)? "#34c74f" : "#ff3a30";

  return obj;
}