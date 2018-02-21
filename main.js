var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


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
