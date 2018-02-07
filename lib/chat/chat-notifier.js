"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const rp = require("request-promise");
const msg = require("./messages");
// Sends messages to the Slack comunicator.
class Slack {
    constructor(url) {
        this.url = url;
    }
    send(message) {
        return rp({
            method: 'POST',
            uri: this.url,
            body: message,
            json: true
        });
    }
}
// Starts listeners for endpoints and documents creations.
class Chat {
    constructor(channel) {
        this.MESSAGE = "MESSAGES";
        this.ACCOUNT_ID = "ADMIN_DRIVELY";
        if (admin.apps.length === 0)
            admin.initializeApp(functions.config().firebase);
        this.firestore = admin.firestore();
        this.channel = channel.channelId;
        this.token = channel.token;
        this.slack = new Slack(channel.url);
    }
    startOnDocumentListener() {
        return functions.firestore
            .document(`${this.MESSAGE}/${this.channel}/${this.MESSAGE}/{messageId}`)
            .onCreate(event => {
            const message = event.data.data();
            if (message.idSender === this.ACCOUNT_ID)
                return;
            const firestoreMessage = new msg.SlackMessage(message.text, message.nameSender, new Date(message.timestamp));
            this.slack.send(firestoreMessage)
                .then(() => { console.log(firestoreMessage.text + " | WAS SENT SUCCESSFULLY!"); })
                .catch(() => { console.log(firestoreMessage.text + " | WAS NOT SENT!"); });
        });
    }
    startOnRequestListener() {
        return functions.https.onRequest((req, res) => {
            // Prevent recursive calls
            if (req.body.token !== this.token)
                return;
            const message = req.body.text;
            const trigger = req.body.trigger_word;
            this.setObject(new msg.FirestoreMessage(this.channel, message.split(trigger)[1].trim()))
                .then(() => { res.sendStatus(200); })
                .catch(() => { res.sendStatus(500); });
        });
    }
    setObject(message) {
        return this.firestore.collection(this.MESSAGE).doc(this.channel).collection(this.MESSAGE).doc().set(message);
    }
}
exports.default = Chat;
//# sourceMappingURL=chat-notifier.js.map