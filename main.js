var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var OAuth = require('oauth');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('*', function(req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
});

// handling 404 errors
app.use(function(err, req, res, next) {
  if (err.status !== 404) {
    return next();
  }
  res.send(err.message || '404 Page Not Found');
});

//Emites a message saying what to do, and returns ten tweets based on what the user input
io.on('connection', function(socket) {
  io.emit('chat message', "Please Enter a Keyword to See Twitter Posts");
  console.log('a user connected');
  socket.on('chat message', function(msg) {
    
        var oauth = new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      process.env.oauth1,
      process.env.oauth2,
      '1.0A',
      null,
      'HMAC-SHA1'
    );    var oauth = new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      process.env.oauth1,
      process.env.oauth2,
      '1.0A',
      null,
      'HMAC-SHA1'
    );
    
        oauth.get(
      'https://api.twitter.com/1.1/search/tweets.json?q=' + msg + "&count=10",
      process.env.oauth3,
      process.env.oauth4,
      function(e, data, res) {
        console.log("twitter api call complete")
        if (e) console.error(e);
        data = JSON.parse(data)
        console.log(data)
        for (var i in data["statuses"]) {
          io.emit('chat message', data["statuses"][i]["text"]);
        }
      });
    
    io.emit('chat message', msg);

  });
  //send a message on disconnect
  socket.on('disconnect', function(socket) {
    console.log("someone disconnected")
  })
});

http.listen(process.env.PORT, function() {
  console.log(process.env.IP + ":" + process.env.PORT);
});

