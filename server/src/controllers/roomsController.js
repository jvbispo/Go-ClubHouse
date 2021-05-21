import { constants } from "../../../app/pages/_shared/constants.js";
import Attendee from "../entities/attendee.js";

export default class RoomsController {
   #users = new Map();
   constructor() { 
      this.rooms = new Map()
   }
   
   onNewConnection(socket) {
      const { id } = socket;
      console.log('connection stablished with', id)
      this.#updateGlobalUserData(id, )
   };

   joinRoom(socket, { user, ...room }) {
      const userId = user.id = socket.id;
      const roomId = room.id;

      const updatedUserdata = this.#updatedGloalUserData(userId, user, roomId);

      socket.emit(constants.events.USER_CONNECTED, updatedUserdata)
   };

   #updateGlobalUserData(userId, userData = {}, roomId = '') {
      const users = this.#users;
      const user = users.get(userId) ?? {}
      const existingRoom = this.rooms.has(roomId);

      const updatedUserData = new Attendee({
         ...user,
         ...userData,
         roomId,
         isSpeaker: !existingRoom
      })

      this.#users.set(userId, updatedUserData);

      return this.#users.get(userId);
   }

   getEvents() {
      const functions = Reflect.ownKeys(RoomsController.prototype)
         .filter(fn => fn !== 'constructor')
         .map(name => [name, this[name].bind(this)]);

      return new Map(functions);
   }
};