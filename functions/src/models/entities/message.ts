// The entity form the collection MESSAGES

import { Transform } from "class-transformer";

export default class Message {
    public emailSender: string;
    public idReceiver: string;
    public idSender: string;
    public idRoom: string;
    public nameSender: string;
    public text: string;

    @Transform(value => value.toString())
    public timestamp: number;
}