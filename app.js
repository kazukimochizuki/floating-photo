
/**
 * Module dependencies.
 */

// http://lealog.hateblo.jp/entry/2013/01/08/010232
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
// var mongodb = require('mongodb');

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));//ファイル名を叩けば出る

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// socket.ioの設定
var io = require('socket.io').listen(server);
app.set('io', io);

// connection = ソケットを受け取ったら
io.sockets.on('connection', function(socket){//サーバーは複数のsocketを受けられるので's'がつく
	socket.on('publish', function(data){
		console.log(data);
		io.sockets.emit('stream', data);//io.socketsにしたら上手くいった
	});
});

module.exports = app;
