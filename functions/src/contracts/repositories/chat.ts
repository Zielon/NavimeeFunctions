import Room from "../../models/entities/chat/room";
import Member from "../../models/entities/chat/member";
import User from "../../models/entities/user";

export default interface IChatRepository {
    getRoom(id: string): Promise<Room>
    getRooms(): Promise<Array<Room>>
    addMember(roomId: string, user: User): Promise<void>
}