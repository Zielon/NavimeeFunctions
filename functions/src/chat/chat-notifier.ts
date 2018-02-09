import "reflect-metadata";
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { injectable, inject } from "inversify";

import TYPES from "../types";
import FirestorePaths from '../consts/firestore-paths'
import { IChatNotifier } from "../contracts/chat-notifier";
import { IFcmSender } from "../contracts/fcm-sender";
import FcmPayload from "../models/fcm-payload";

@injectable()
export default class ChatNotifier implements IChatNotifier {
    @inject(TYPES.IFcmSender) private fcm: IFcmSender;
    private firestore: any;

    private readonly MESSAGE_PRIVATE = "MESSAGE_PRIVATE";
    private readonly MESSAGE_GROUP = "MESSAGE_GROUP";

    constructor() {
        if (admin.apps.length === 0)
            admin.initializeApp(functions.config().firebase);

        this.firestore = admin.firestore();
    }

    public startOnGroupChat(): any {
        return functions.firestore
            .document(`${FirestorePaths.messagesGroups}/{roomId}/${FirestorePaths.messages}/{messageId}`)
            .onWrite(event => {
                const roomId = event.params.roomId;
                const messageId = event.params.messageId;
                const message = event.data.data();
                const payload = new FcmPayload(message.text, this.MESSAGE_GROUP, message.idSender, message.nameSender);

                return this.firestore.collection(FirestorePaths.group)
                    .doc(roomId)
                    .collection(FirestorePaths.members).get()
                    .then(snapshot => {
                        snapshot.forEach(member => {
                            let reference = this.firestore.collection(FirestorePaths.users).doc(member.id);
                            return reference.get()
                                .then(document => {
                                    if (!document.exists) return;
                                    let user = document.data();
                                    if (user.token && user.token.length > 0 && user.id !== message.idSender)
                                        this.fcm.sendToSingle(payload, user.token, reference);
                                });
                        });
                    })
            });
    }

    public startOnPrivateChat(): any {
        return functions.firestore
            .document(`${FirestorePaths.messages}/{roomId}/${FirestorePaths.messages}/{messageId}`)
            .onWrite(event => {
                const roomId = event.params.roomId;
                const messageId = event.params.messageId;
                const message = event.data.data();
                const payload = new FcmPayload(message.text, this.MESSAGE_PRIVATE, message.idSender, message.nameSender);

                let reference = this.firestore.collection(FirestorePaths.users).doc(message.idReceiver);
                return reference.get()
                    .then(document => {
                        if (!document.exists) return;
                        let user = document.data();
                        if (user.token && user.token.length > 0)
                            this.fcm.sendToSingle(payload, user.token, reference);
                    })
            });
    }
}