import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as rp from 'request-promise'

import * as msg from './messages'
import Channel from './channel'

// Sends messages to the Slack comunicator.
class Slack{
    private url: string;

    constructor(url: string){
        this.url = url;
    }

    send(message: msg.SlackMessage): Promise<any>{
        return rp({
            method: 'POST',
            uri: this.url,
            body: message,
            json: true
        })
    }
}

// Starts listeners for endpoints and documents creations.
export default class Chat{
    private firestore: any;
    private channel: string;
    private slack: Slack;
    private token: string;

    private readonly MESSAGE = "MESSAGES";
    private readonly ACCOUNT_ID = "ADMIN_DRIVELY";

    constructor(channel:Channel){
        if(admin.apps.length === 0)
            admin.initializeApp(functions.config().firebase);

        this.firestore = admin.firestore();
        this.channel = channel.channelId;
        this.token = channel.token;
        this.slack = new Slack(channel.url);
    }

    public startOnDocumentListener(): any {
       return functions.firestore
            .document(`${this.MESSAGE}/${this.channel}/${this.MESSAGE}/{messageId}`)
            .onCreate(event => {
                const message = event.data.data();
                if(message.idSender === this.ACCOUNT_ID) return;
                const firestoreMessage = new msg.SlackMessage(message.text, message.nameSender, new Date(message.timestamp))
                this.slack.send(firestoreMessage);
            });
    }

    public startOnRequestListener(): any {
        return functions.https.onRequest((req, res) => {
            // Prevent recursive calls
            if(req.body.token !== this.token) return;

            const message = req.body.text;
            const trigger = req.body.trigger_word;
            this.setObject(new msg.FirestoreMessage(this.channel, message.split(trigger)[1].trim()))
                .then(() => { res.sendStatus(200); })
                .catch(() => { res.sendStatus(500); });
        })
    }

    private setObject(message: msg.FirestoreMessage): Promise<void>{
        return this.firestore.collection(this.MESSAGE).doc(this.channel).collection(this.MESSAGE).doc().set(message)
    }
}