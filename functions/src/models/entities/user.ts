// The entity form the collection USERS

export default class User {
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
}