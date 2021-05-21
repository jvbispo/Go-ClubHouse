import RoomsController from './controllers/roomsController.js';
import SocketServer from './util/socket.js';
import Event from 'events';
import { constants } from './util/constants.js';
const port = process.env.PORT || 3000
const socketServcer = new SocketServer({port})

const roomsController = new RoomsController();

const namespaces = {
    room: {controller: roomsController, eventEmitter: new Event()},

}

const routeConfig = Object.entries(namespaces).map(([namespace, {controller, eventEmitter}]) => {
    const controllerEvents = controller.getEvents();
    eventEmitter.on(constants.events.USER_CONNECTED, controller.onNewConnection.bind(controller));

    return {
        [namespace]: {
            events: controllerEvents,
            eventEmitter,
        }
    }
})



const server = await socketServcer.start();

socketServcer.attachEvents({routeConfig})

console.log('socket server is running at', server.address().port)
