import { constants } from "./constants.js";



export default class SocketBuilder {
    constructor ({socketUrl, namespace}) {
        this.socketUrl = `${socketUrl}/${namespace}`;
        this.onUserConnected = () => {};
        this.onUserDisconnected = () => {};
    }

    setOnUserConnected (fn) {
        this.onUserConnected = fn;
    }

    setOnUserDisconnected (fn) {
        this.onUserDisconnected = fn;
    }

    build () {
       const socket = globalThis.io.connect(this.socketUrl, {
            withCredentials: false,
        });

        socket.on(constants.events.USER_CONNECTED, this.onUserConnected);
        socket.on('connection', () => console.log('usuário conectado'));
        socket.on(constants.events.USER_DISCONNECTED, this.onUserDisconnected);
    }
}