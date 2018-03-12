import "reflect-metadata";
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as rp from 'request-promise'
import * as moment from 'moment';
import { injectable, inject } from "inversify";

import { ISerializable } from "../contracts/serializable";
import ISlackService from "../contracts/services/slack-service"
import TYPES from "../types";
import IFirestore from "../contracts/services/firestore-service";
import SlackChannel from "../models/slack-channel";
import FirestorePaths from "../consts/firestore-paths";
import SlackMessage from "../models/slack-message";
import FirestoreMessage from "../models/firebase-message";
import { WriteResult } from "@google-cloud/firestore";

@injectable()
export default class SlackService implements ISlackService {

    @inject(TYPES.IFirestore) private firestore: IFirestore;

    private readonly ACCOUNT_ID = "ADMIN_DRIVELY";

    public startOnDocumentListener(slackChannel: SlackChannel): any {
        return functions.firestore
            .document(`${FirestorePaths.messagesGroups}/{country}/${slackChannel.channelId}/{messageId}`)
            .onCreate(event => {
                const message = event.data.data();
                if (message.idSender === this.ACCOUNT_ID) return;
                const firestoreMessage = new SlackMessage(message.text, message.nameSender)
                this.send(firestoreMessage, slackChannel.url);
            });
    }

    public startOnRequestListener(slackChannel: SlackChannel): any {
        return functions.https.onRequest((req, res) => {
            // Prevent recursive calls
            if (req.body.token !== slackChannel.token) return Promise.resolve();

            const message = req.body.text;
            const trigger = req.body.trigger_word;
            return this.setObject(new FirestoreMessage(slackChannel.channelId, message.split(trigger)[1].trim()), slackChannel.channelId)
                .then(() => { res.sendStatus(200); })
                .catch(() => { res.sendStatus(500); });
        });
    }

    public send<T extends ISerializable>(message: T, url: string): Promise<any> {
        return rp({
            method: 'POST',
            uri: url,
            body: {
                attachments: [
                    message.serialize()
                ]
            },
            json: true
        })
    }

    private setObject<T extends ISerializable>(message: T, channel: string): Promise<WriteResult> {
        return this.firestore.getFirestore()
            .collection(FirestorePaths.messagesGroups)
            .doc(FirestorePaths.country)
            .collection(channel)
            .doc().set(message.serialize())
    }
}