import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as rp from 'request-promise'

import * as msg from './messages'

// Sends messages to the Slack comunicator.
class Slack{
    url: string;

    constructor(url: string){
        this.url = url;
    }

    send(message: msg.SlackMessage): Promise<void>{
        return rp({
            method: 'POST',
            uri: this.url,
            body: message
        })
    }
}

// Starts listeners for endpoints and documents creations.
export default class Chat{
    firestore: any;
    channel: string;
    slack: Slack;
    token: string;

    private readonly MESSAGE = "MESSAGES";
    private readonly ACCOUNT_ID = "ADMIN_DRIVELY";

    constructor(channel: string, url: string, token: string){
        if(admin.apps.length === 0)
            admin.initializeApp(functions.config().firebase);

        this.firestore = admin.firestore();
        this.channel = channel;
        this.slack = new Slack(url);
    }

    public startOnDocumentListener(){
       functions.firestore
        .document(`${this.MESSAGE}/${this.channel}/${this.MESSAGE}/{messageId}`)
        .onCreate(event => {
            const message = event.data.data();
            if(message.idSender === this.ACCOUNT_ID) return;
            const firestoreMessage = new msg.SlackMessage(message.text, message.nameSender, new Date(message.timestamp))
            this.slack.send(firestoreMessage)
            .then(() => { console.log(firestoreMessage.text + " | WAS SENT SUCCESSFULLY!")})
            .catch(() => { console.log(firestoreMessage.text + " | WAS NOT SENT!")});
        });
    }

    public startOnRequestListener(){
        functions.https.onRequest((req, res) => {
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