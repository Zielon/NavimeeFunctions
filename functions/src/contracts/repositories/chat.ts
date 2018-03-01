import Room from "../../models/entities/chat/room";
import Member from "../../models/entities/chat/member";
import User from "../../models/entities/user";
import { WriteResult } from "@google-cloud/firestore";

export default interface IChatRepository {
    getRoom(id: string, user: User): Promise<Room>
    getRooms(user: User): Promise<Array<Room>>
    addMember(roomId: string, user: User): Promise<WriteResult>
}