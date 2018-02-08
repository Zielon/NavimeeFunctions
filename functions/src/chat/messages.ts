import * as moment from 'moment'
import dateFormat from 'dateformat'
import * as admin from 'firebase-admin'

import { Serializable } from './serializable'
import { classToPlain, Expose } from "class-transformer";

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

    constructor() {
        this.short = false;
        this.title = 'Application';
        this.value = process.env.GCLOUD_PROJECT;
    }

    public serialize(): any {
        return classToPlain(this);
    }
}

export class SlackMessage implements Serializable {
    text: string;
    color: string;
    fields: [SlackFields];
    ts: number;
    footer: string;

    @Expose({ name: "author_name" })
    author: string;

    constructor(text: string, author: string, date: number) {
        this.color = "#E40455";
        this.text = text;
        this.fields = [new SlackFields()];
        this.ts = date;
        this.footer = "Drively Chat";
        this.author = `Author: ${author}`;
    }

    public serialize(): any {
        return classToPlain(this);
    }
}