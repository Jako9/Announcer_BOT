const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express')
const session = require('express-session');
const request = require('request');
const moment = require('moment');
const axios = require('axios');



const privateKey = fs.readFileSync(__dirname +'/https/privkey.pem', 'utf8');
const certificate = fs.readFileSync(__dirname + '/https/cert.pem', 'utf8');
const ca = fs.readFileSync(__dirname + '/https/chain.pem', 'utf8');

const nodeprivateKey = fs.readFileSync('/https/node.key', 'utf8');
const nodecertificate = fs.readFileSync('/https/node.crt', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

const agent = new https.Agent({  
  rejectUnauthorized: false,
  key: privateKey,
	cert: certificate
});

const dbManager = require('./managers/databaseManager');

const formidableMiddleware = require('formidable');
const bcrypt = require('bcryptjs');

const path = require('path');
const onlineManager = require('./managers/onlineManager');
const databaseManager = require('./managers/databaseManager');
const { exec } = require('child_process');

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
  if(req.session.loggedin){
    dbManager.getStatistics().then((content) => {
      let statistics = formatStatistics(JSON.parse(content));
  
      onlineManager.getOnlineStatus().then((status) => {
	      console.dir(status.data.running);
        databaseManager.getServers((servers) => {
          databaseManager.getVips((vips) => {
            let online = formatOnline(status.data);
  
            let botRoute = (status.data.running == 1) ? "/backend/kill" : "/backend/restart";
  
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
  }else{
    res.redirect('/login');
  }
});

app.post('/backend/kill', (req, res) => {
  if(req.session.loggedin){
    const form = formidableMiddleware(formidableCache);
 
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    
    onlineManager.killServer().then(() =>{
      res.redirect('/backend');
    });
    
  });
  }
});

app.post('/backend/restart', (req, res) => {
  if(req.session.loggedin){
    const form = formidableMiddleware(formidableCache);
 
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    onlineManager.killServer().then(() =>{
      onlineManager.startServer().then(() => {
        res.redirect('/backend');
      });
    });
  });
  }
});

app.post('/backend/saveserver/:editi-:id', (req, res) => {
  if(req.session.loggedin){
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
  }
});

app.post('/backend/resetserver/:editi-:id', (req, res) => {
  if(req.session.loggedin){
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
  }
});

app.get('/login', (req, response) =>{
  if(req.session.loggedin){
    response.redirect('/');
  }else{
    response.render('login', {"error": false});
  }
});

app.post('/auth', (req, response) =>{
  const form = formidableMiddleware({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    if(fields.user && fields.password ){
      const password = fields.password;
      const username = fields.user;

      if(username == process.env.WEBUSER){
        bcrypt.compare(fields.password, process.env.WEBPASSWORD, function(err, password_res){
          console.log(process.env.WEBPASSWORD);
          if(password_res){
            req.session.loggedin = true;
            req.session.username = username;
            response.redirect('/backend');
          }else{
            response.render('login', {"error": true});
          }
        });
      }else{
        response.render('login', {"error": true});
      }
    }else{
      response.render('login', {"error": true});
    }
  });
});

app.get('/backend/logs/error', (req, res) => {
  if(req.session.loggedin){
    databaseManager.getErrorlog().then((result) => {
      res.send(result);
    })
  }
});

app.get('/backend/logs/boot', (req, res) => {
  if(req.session.loggedin){
    databaseManager.getBootlog().then((result) => {
      res.send(result);
    })
  }
});

app.get('/backend/logs/debug', (req, res) => {
  if(req.session.loggedin){
    databaseManager.getDebuglog().then((result) => {
      res.send(result);
    })
  }
});



app.post('/backend/logs/error', (req, res) => {
  if(req.session.loggedin){
    databaseManager.resetErrorlog().then((result) => {
      res.redirect("/backend");
    })
  }
});

app.post('/backend/logs/debug', (req, res) => {
  if(req.session.loggedin){
    databaseManager.resetDebuglog().then((result) => {
      res.redirect("/backend");
    })
  }
});

app.post('/backend/logs/boot', (req, res) => {
  if(req.session.loggedin){
    databaseManager.resetBootlog().then((result) => {
      res.redirect("/backend");
    })
  }
});

app.post('/backend/github', (req, res) => {
  const form = formidableMiddleware({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    if(typeof(fields.payload) != 'undefined'){
      const githubObj = JSON.parse(fields.payload);

      if(githubObj.repository.url == 'https://github.com/Jako9/Announcer_BOT'){
        if(githubObj.ref == 'refs/heads/' + process.env.BRANCH){
          axios.post('https://node:3443/kill',  { httpsAgent: agent }).then(function (response) {  
            exec('cd gitCopy && git pull', (err, stdout, stderr) => {
              if(!err){
                axios.post('https://node:3443/start',  { httpsAgent: agent }).then(function (response) {
                  res.send(stdout);
                })
                .catch(function (error) {
                  console.log(error);
                });
              }else{
                res.send(stderr);
              }
            })
          })
          .catch(function (error) {
            console.log(error);
          });
        }
      }
    }
  });
});

app.get('/api/thankyou', (req, res) => {
  databaseManager.getAPICreds('handleThankYou', (result) => {
    let paymentId = req.query.paymentId;
    let token = req.query.token;
    let payerID = req.query.PayerID;

    if(paymentId && token && payerID){
      axios.post(result.link + "/?paymentId=" + paymentId + "&token=" + token + "&PayerID=" + payerID + "&pass=" + result.password).then(function (response) {
        res.render('thankyou');
      })
      .catch(function (error) {
        console.log(error);
      });
    }else{
      res.send('You are not allowed to access this page!');
    }
  });
});

app.post('/api/transaction', (req, res) => {
  const form = formidableMiddleware({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    
    databaseManager.getAPICreds('processPayment', (result) => {
      let transID = fields.transID;
      let state = fields.state;
      let pass = fields.pass;
  
      if(transID && state && pass){
        if(pass == result.password){
          databaseManager.updatePendingPayment(state, transID, (ergeb) => {
            if(ergeb){
              res.send('success');
            }else{
              res.send('fail');
            }
          });
        }
      }else{
        res.send('fail');
      }
    });
  });
});

//app.get('/.well-known/acme-challenge/pD31x-flZb0bvGKMNlJHr8g-hbB_VIEUhkC7sF_hv6E', (req, res) => {
//  res.sendFile(__dirname + '/assets/https/pD31x-flZb0bvGKMNlJHr8g-hbB_VIEUhkC7sF_hv6E');
//}); //Route nut notwendig wenn auf HTTPS geupgraded werden soll

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});


function formatStatistics(statistics){
  let timeInMillisecs = statistics.totalPlaytime;
  let tempTime = moment.duration(timeInMillisecs);

  statistics.totalPlaytime = tempTime.days() + tempTime.hours() + ":" + tempTime.minutes() + ":" + tempTime.seconds();

  return statistics;
}

function formatOnline(onlineStatus){
  let hstatus = (onlineStatus.running == 1);

  let obj = {};

  obj.status = hstatus;
  obj.text = (hstatus)? "Online" : "Offline";
  obj.color = (hstatus)? "#34c74f" : "#ff3a30";

  return obj;
}
