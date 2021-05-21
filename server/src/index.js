import SocketServer from './util/socket.js';

const port = process.env.PORT || 3000
const socketServcer = new SocketServer({port})

const server = await socketServcer.start();
console.log('socket server is running at', server.address().port)
