
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , io = require('socket.io')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// set route
app.get('/', routes.index);


// start http server
var httpServer = http.createServer(app);
httpServer.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// websocket settings
var socketServer = io(httpServer);
socketServer.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('chat message', function(msg) {
    console.log('message : ' + msg);
    socketServer.emit('chat message', msg);
  });

  socket.on('disconnect', function() {
    console.log('user disconnect');
  });
});

