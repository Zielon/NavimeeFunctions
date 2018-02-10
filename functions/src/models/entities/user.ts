import { ISerializable } from "../../contracts/serializable";
import { classToPlain } from "class-transformer";

// The entity form the collection USERS

export default class User implements ISerializable{
    public avatar: string;
    public defaultAvatar: boolean;
    public email: string;
    public id: string;
    public isOnline: boolean;
    public name: string;
    public timestamp: number;
    public token: string;
    // Settings
    public bigEventsNotification: boolean;
    public dayScheduleNotification: boolean;
    public chatPrivateNotification: boolean;
    public chatGroupNotification: boolean;

    public serialize(): any {
        return classToPlain(this);
    }
}