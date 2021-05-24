import { constants } from "../../_shared/constants.js";
import RoomSocketBuilder from "./utils/roomSocket.js";

const socketBuilder = new RoomSocketBuilder({
    socketUrl: constants.socketUrl,
    namespace: constants.socketNameSpaces.room,
})

socketBuilder.setOnUserConnected((user) => console.log('user connected', user));
socketBuilder.setOnUserDisconnected((user) => console.log('user disconnected', user));
socketBuilder.setOnRoomUpdated((room) => console.log('room list', room));
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
console.log('b')