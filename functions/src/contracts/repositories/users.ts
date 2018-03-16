import User from "../../models/entities/user";

export default interface IUsersRepository{
    getUser(id: string) : Promise<User>
    addRoom(userId: string, roomId: string): Promise<void>
    getFrineds(id: string): Promise<Array<string>>
    getRooms(id: string): Promise<Array<string>>
}