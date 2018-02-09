import * as admin from 'firebase-admin'
import { classToPlain } from "class-transformer";
import { ISerializable } from "../contracts/serializable";

export default class FcmPayload implements ISerializable {
    private text: string;
    private type: string;
    private idSender: string;
    private nameSender: string;

    constructor(text: string, type: string, idSender: string, nameSender: string){
        this.text = text;
        this.type = type;
        this.idSender = idSender;
        this.nameSender = nameSender;
    }

    public serialize(): any {
        return { 
            data : classToPlain(this) 
        };
    }
}