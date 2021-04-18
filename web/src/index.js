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
const databaseManager = require('./managers/databaseManager');

const app = express()
const port = 80

app.set('view engine','ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + "/pages");

app.use('/assets/', express.static(__dirname + '/assets/'));
app.use('/resources/', express.static('/web/resources/'));

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

app.get('/backend', (req, res) => {
  dbManager.getStatistics().then((content) => {
    let statistics = formatStatistics(JSON.parse(content));

    onlineManager.getOnlineStatus().then((status) => {
      databaseManager.getServers((servers) => {
        databaseManager.getVips((vips) => {
          let online = formatOnline(status.data);

          let botRoute = (status == 1)? "http://localhost:3000/kill" : "http://localhost:3000/restart";

          res.render("backend", {
            "statistics": statistics,
            "online": online,
            "announcerRoute": botRoute,
            "servers": servers,
            "vips": vips
          });
        })
      })
    })
  }).catch(function(error) {
    console.log(error);
    res.send("uff");
 })
});

app.post('/backend/saveserver/:editi-:id', (req, res) => {
  const form = formidableMiddleware(formidableCache);
 
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    databaseManager.updateServer(req.params.id ,fields['prefix-char-' + req.params.editi], fields['volume-range-' + req.params.editi], (flawless) => {
      if(flawless){
        res.redirect("/backend");
      }
    })
  });
});

app.post('/backend/resetserver/:editi-:id', (req, res) => {
  const form = formidableMiddleware(formidableCache);
 
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    databaseManager.updateServer(req.params.id , '.', '0.2', (flawless) => {
      if(flawless){
        res.redirect("/backend");
      }
    })
  });
});

app.get('/backend/logs/error', (req, res) => {
  databaseManager.getErrorlog().then((result) => {
    res.send(result);
  })
});

app.get('/backend/logs/boot', (req, res) => {
  databaseManager.getBootlog().then((result) => {
    res.send(result);
  })
});

app.get('/backend/logs/debug', (req, res) => {
  databaseManager.getDebuglog().then((result) => {
    res.send(result);
  })
});



app.post('/backend/logs/error', (req, res) => {
  databaseManager.resetErrorlog().then((result) => {
    res.redirect("/backend");
  })
});

app.post('/backend/logs/debug', (req, res) => {
  databaseManager.resetDebuglog().then((result) => {
    res.redirect("/backend");
  })
});

app.post('/backend/logs/boot', (req, res) => {
  databaseManager.resetBootlog().then((result) => {
    res.redirect("/backend");
  })
});

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

  obj.status = hstatus;
  obj.text = (hstatus)? "Online" : "Offline";
  obj.color = (hstatus)? "#34c74f" : "#ff3a30";

  return obj;
}