import { ISerializable } from "../../contracts/serializable";
import { classToPlain } from "class-transformer";

// The entity form the collection USERS

export default class User implements ISerializable{
    public email: string;
    public id: string;
    public isOnline: boolean;
    public name: string;
    public timestamp: number;
    public token: string;
    public city: string;
    public country: string;
    public driverType: string;

    // Settings
    public bigEventsNotification: boolean;
    public dayScheduleNotification: boolean;
    public chatPrivateNotification: boolean;
    public chatGroupNotification: boolean;
    public shareLocalization: boolean;

    public serialize(): any {
        return classToPlain(this);
    }
}