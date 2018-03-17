// The entity form the collection MESSAGES

import { Transform, classToPlain } from "class-transformer";
import { ISerializable } from "../../contracts/serializable";

export default class Message implements ISerializable {
    public emailSender: string;
    public idReceiver: string;
    public idSender: string;
    public idRoom: string;
    public nameSender: string;
    public text: string;

    @Transform(value => value.toString())
    public deleted: boolean;

    @Transform(value => value.toString())
    public timestamp: number;

    public serialize(): any {
        return classToPlain(this);
    }
}