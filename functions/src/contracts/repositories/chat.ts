import Room from "../../models/entities/chat/room";
import Member from "../../models/entities/chat/member";
import User from "../../models/entities/user";
import { WriteResult } from "@google-cloud/firestore";

export default interface IChatRepository {
    getRoom(id: string, country: string): Promise<Room>
    getRooms(country: string): Promise<Array<Room>>
    addMember(roomId: string, user: User): Promise<WriteResult>
    deleteFromGroup(user: User, groups: Array<string>): Promise<void>
    deleteGroupMessages(user: User, groups: Array<string>): Promise<void>
    deletePrivateMessages(user: User, friends: Array<string>): Promise<void>
    deleteFromFriends(userId: string, friends: Array<string>): Promise<void>
}