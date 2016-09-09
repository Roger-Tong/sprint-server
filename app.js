'user strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// TODO these need to be persisted
var readItems = ['aaa'];
var unreadItems = ['bbb'];
var users = ['user-a', 'user-b'];

server.listen(3000, function() {
	console.log('Server is running on port %d', 3000);
});

io.sockets.on('connection', function(socket) {
	console.log('A client is connection...');
	socket.emit('items', {readItems: readItems, unreadItems: unreadItems});
	socket.emit('users', users);
	
	socket.on('add an unread item', function(item) {
		console.log('add a item to unread list: ', item);
		unreadItems = unreadItems.concat([item]);
		socket.emit('items', {unreadItems: unreadItems, readItems: readItems});
		socket.broadcast.emit('items', {unreadItems: unreadItems, readItems: readItems});
		console.log('current readItems: ' + readItems);
		console.log('current unreadItems: ' + unreadItems);
	});
	
	socket.on('mark an unread item as read', function(item) {
		console.log('mark an unread item as read: ', item);
		unreadItems.splice(unreadItems.indexOf(item), 1);
		readItems = readItems.concat([item]);
		socket.emit('items', {unreadItems: unreadItems, readItems: readItems});
		socket.broadcast.emit('items', {unreadItems: unreadItems, readItems: readItems});
		console.log('current readItems: ' + readItems);
		console.log('current unreadItems: ' + unreadItems);
	});
	
	socket.on('mark a read item as unread', function(item) {
		console.log('mark a read item as unread: ', item);
		readItems.splice(readItems.indexOf(item), 1);
		unreadItems = unreadItems.concat([item]);
		socket.emit('items', {unreadItems: unreadItems, readItems: readItems});
		socket.broadcast.emit('items', {unreadItems: unreadItems, readItems: readItems});
		console.log('current readItems: ' + readItems);
		console.log('current unreadItems: ' + unreadItems);
	});
	
	socket.on('login', function(item) {
		console.log('a user logged in: ', item);
		users.push(item);
		socket.emit('users', users)
	});

});

