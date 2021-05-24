import { constants } from "../../../app/pages/_shared/constants.js";
import Attendee from "../entities/attendee.js";
import Room from '../entities/room.js';
export default class RoomsController {
   #users = new Map();
   constructor() { 
      this.rooms = new Map()
   }
   
   onNewConnection(socket) {
      const { id } = socket;
      console.log('connection stablished with', id)
      this.updateGlobalUserData(id)
   };

   joinRoom(socket, { user, room }) {
      const userId = user.id = socket.id;
      const roomId = room.id;

      const updatedUserdata = this.updateGlobalUserData(userId, user, roomId);

      const updatedRoom = this.joinUserRoom(socket, user, room);
      
      this.notifyUsersOnRoom(socket, roomId, updatedUserdata);
      this.replyWithActiveUsers(socket, updatedRoom.users);
   };

   replyWithActiveUsers(socket, users) {
      const event = constants.events.LOBBY_UPDATED;

      socket.emit(event, [...users.values()]);
   }

   notifyUsersOnRoom(socket, roomId, user) {
      const event = constants.events.USER_CONNECTED;

      socket.to(roomId).emit(event, user);
   }

   joinUserRoom(socket, user, room) {
      const roomId = room.id;
      const existingRoom = this.rooms.has(roomId);

      const currentRoom = existingRoom ? this.rooms.get(roomId): {}

      const currentUser = new Attendee({
         ...user,
         roomId,
      });

      const [owner, users] = existingRoom ? [currentRoom.owner, currentRoom.users] : [currentUser, new Set()]

      const updatedRoom = this.mapRoom({...currentRoom, ...room, owner, users: new Set([...users, ...[currentUser]])})

      this.rooms.set(roomId, updatedRoom);

      socket.join(roomId);

      return this.rooms.get(roomId)
   }

   mapRoom(room) {
      const users = [...room.users.values()];
      const speakersCount = users.filter(user => user.isSpeaker).length;
      const featuredAttendees = users.slice(0, 3);

      const mappedRoom = new Room({
         ...room,
         featuredAttendees,
         speakersCount,
         attendeesCount: room.users.size,
      })

      return mappedRoom;
      
   }

   updateGlobalUserData(userId, userData = {}, roomId = '') {
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