const socket = io();

console.log('hello');

socket.on('database', function(data) {
    console.log('Got announcement:', data);
});