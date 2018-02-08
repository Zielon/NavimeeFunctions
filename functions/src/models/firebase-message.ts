import * as moment from 'moment'
import { classToPlain, Expose } from "class-transformer";
import { Serializable } from '../contracts/serializable';

export default class FirestoreMessage implements Serializable {
    emailSender: string;
    idReceiver: string;
    idSender: string;
    nameSender: string;
    text: string;
    timestamp: number;

    constructor(channel: string, text: string) {
        this.emailSender = "kontakt@drively.pl";
        this.nameSender = "Drively";
        this.timestamp = moment().valueOf();
        this.idSender = "ADMIN_DRIVELY";
        this.idReceiver = channel;
        this.text = text;
    }

    public serialize(): any {
        return classToPlain(this);
    }
}