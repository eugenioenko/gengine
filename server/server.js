var io = require('socket.io')();

console.log('Server is listening');

io.on('connection', (socket) => {
	// new player was connected
	socket.broadcast.emit('enter_player', {id: socket.id, x: 0, y: 0});
	// a player has moved, update everybody on new position (data.x data.y data.id)
	socket.on('move_player', (data) => {
		socket.broadcast.emit('update_player', data);
	});
	// a player has disconnected
	socket.on('disconnect', (data) => {
		io.emit('leave_player', {id: socket.id});
	});
});

io.listen(3331);

/**
 * cheat sheet
 * // sending to sender-client only
socket.emit('message', "this is a test");

// sending to all clients, include sender
io.emit('message', "this is a test");

// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients in 'game' room(channel), include sender
io.in('game').emit('message', 'cool game');

// sending to sender client, only if they are in 'game' room(channel)
socket.to('game').emit('message', 'enjoy the game');

// sending to all clients in namespace 'myNamespace', include sender
io.of('myNamespace').emit('message', 'gg');

// sending to individual socketid
socket.broadcast.to(socketid).emit('message', 'for your eyes only');
 */
