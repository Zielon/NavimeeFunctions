import * as admin from 'firebase-admin'
import { classToPlain } from "class-transformer";
import { ISerializable } from "../contracts/serializable";
import Message from './entities/message';

export default class FcmPayload implements ISerializable {
    private message: Message;
    private avatar: string;
    private type: string;

    constructor(message: Message) {
        this.message = message;
    }

    public setAvatar(avatar: string): void {
        this.avatar = avatar;
    }

    public setType(type: string): void {
        this.type = type;
    }

    public serialize(): any {
        return {
            data: Object.assign({}, { avatar: this.avatar, type: this.type }, classToPlain(this.message))
        };
    }
}