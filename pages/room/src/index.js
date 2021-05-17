import { constants } from "../../_shared/constants.js";
import SocketBuilder from "../../_shared/socket.js";

const socketBuilder = new SocketBuilder({
    socketUrl: constants.socketUrl,
    namespace: constants.socketNameSpaces.room,
})

socketBuilder.setOnUserConnected((user) => console.log('user connected', user));
socketBuilder.setOnUserDisconnected((user) => console.log('user disconnected', user))

const socket = socketBuilder.build();



const room = {
    id: Date.now(),
    topic: 'JS Expert',

};

const user = {
    img: '',
    username: 'João'
}

socket.emit(constants.events.JOIN_ROOM, {user, room});