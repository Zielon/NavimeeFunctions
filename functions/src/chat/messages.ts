import * as moment from 'moment'
import * as df from 'dateformat'

export class FirestoreMessage{
    emailSender: string;
    idReceiver: string;
    idSender: string;
    nameSender: string;
    text: string;
    timestamp: number;

    constructor(channel: string, text: string){
        this.emailSender = "kontakt@drively.pl";
        this.nameSender = "Drively"
        this.timestamp = moment().valueOf()
        this.idSender = "ADMIN_DRIVELY"
        this.idReceiver = channel
        this.text = text
    }
}

class SlackFields{
    title: string;
    value: string;
    short: boolean;

    constructor(author: string, date: Date){
        this.short = false;
        this.value = df.dateFormat(date, "dddd, mmmm dS, yyyy, h:MM:ss TT");
        this.title = `Message from ${author}`
    }
}

export class SlackMessage{
    text: string;
    color: string;
    fields: [SlackFields];

    constructor(text: string, author: string, date: Date){
        this.color = "#D00000";
        this.text = text;
        this.fields = [new SlackFields(author, date)];
    }
}