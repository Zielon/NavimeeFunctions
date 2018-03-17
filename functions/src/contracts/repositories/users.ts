import User from "../../models/entities/user";
import { WriteResult } from "@google-cloud/firestore";

export default interface IUsersRepository{
    getUser(id: string) : Promise<User>
    addRoom(userId: string, roomId: string): Promise<WriteResult>
    getFrineds(id: string): Promise<Array<string>>
    getRooms(id: string): Promise<Array<string>>
    deleteUser(id: string): Promise<WriteResult>
}