import "reflect-metadata";
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { inject } from "inversify";

import TYPES from "../types";
import FirestoreMessage from '../models/firebase-message'
import SlackMessage from '../models/slack-message'
import SlackChannel from '../models/slack-channel'
import { ISerializable } from "../contracts/serializable";
import FirestorePaths from "../consts/firestore-paths";
import IFirestore from "../contracts/services/firestore-service";
import { ISlackService } from "../contracts/services/slack-sender";

export default class ChatSlack {
    private channel: string;
    private token: string;
    @inject(TYPES.ISlackService) private slack: ISlackService;
    @inject(TYPES.IFirestore) private firestore: IFirestore;

    private readonly ACCOUNT_ID = "ADMIN_DRIVELY";

    constructor(channel: SlackChannel) {
        this.channel = channel.channelId;
        this.token = channel.token;
    }

    public startOnDocumentListener(): any {
        return functions.firestore
            .document(`${FirestorePaths.messagesGroups}/{country}/${this.channel}/{messageId}`)
            .onCreate(event => {
                const message = event.data.data();
                if (message.idSender === this.ACCOUNT_ID) return;
                const firestoreMessage = new SlackMessage(message.text, message.nameSender, Number(message.timestamp), event.params.messageId)
                this.slack.send(firestoreMessage);
            });
    }

    public startOnRequestListener(): any {
        return functions.https.onRequest((req, res) => {
            // Prevent recursive calls
            if (req.body.token !== this.token) return Promise.resolve();

            const message = req.body.text;
            const trigger = req.body.trigger_word;
            return this.setObject(new FirestoreMessage(this.channel, message.split(trigger)[1].trim()))
                .then(() => { res.sendStatus(200); })
                .catch(() => { res.sendStatus(500); });
        });
    }

    private setObject<T extends ISerializable>(message: T): Promise<void> {
        return this.firestore.get()
        .collection(FirestorePaths.messagesGroups)
        .doc(FirestorePaths.country)
        .collection(this.channel)
        .doc(FirestorePaths.roomDetails)
        .collection(FirestorePaths.members)
        .doc().set(message.serialize())
    }
}