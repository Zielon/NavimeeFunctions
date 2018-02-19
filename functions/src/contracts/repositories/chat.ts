import Room from "../../models/entities/chat/room";

export default interface IChatRepository{
    getRoom(id: string) : Promise<Room>
}