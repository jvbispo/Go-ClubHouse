import { constants } from "../../../_shared/constants.js";
import SocketBuilder from '../../../_shared/socket.js'

export default class RoomSocketBuilder extends SocketBuilder{
    constructor({socketUrl, namespace}) {
        super({socketUrl, namespace});
    }
}