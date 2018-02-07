import * as moment from 'moment'
import dateFormat from 'dateformat'
import { Serializable } from './serializable'
import { classToPlain } from "class-transformer";

export class FirestoreMessage implements Serializable {
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

class SlackFields implements Serializable {
    title: string;
    short: boolean;
    value: string;

    constructor(author: string, date: Date) {
        this.short = false;
        this.title = `Message from [${author}]`;
        this.value = 'Details';
    }

    public serialize(): any {
        return classToPlain(this);
    }
}

export class SlackMessage implements Serializable {
    text: string;
    color: string;
    fields: [SlackFields];
    ts: string;
    footer: string;

    constructor(text: string, author: string, date: Date) {
        this.color = "#E40455";
        this.text = text;
        this.fields = [new SlackFields(author, date)];
        this.ts = date.getMilliseconds().toString();
        this.footer = "Drively Chat"
    }

    public serialize(): any {
        return classToPlain(this);
    }
}