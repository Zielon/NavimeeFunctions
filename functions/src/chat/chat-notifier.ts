import "reflect-metadata";
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { injectable, inject } from "inversify";
import { plainToClass } from "class-transformer";

import TYPES from "../types";
import FirestorePaths from '../consts/firestore-paths'
import { IChatNotifier } from "../contracts/chat-notifier";
import { IFcmSender } from "../contracts/fcm-sender";
import FcmPayload from "../models/fcm-payload";
import Message from "../models/entities/message";
import User from "../models/entities/user";

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
            .onCreate(event => {
                const roomId = event.params.roomId;
                const messageId = event.params.messageId;
                const message = plainToClass(Message, event.data.data() as Object)
                const payload = new FcmPayload(message);

                return this.firestore.collection(FirestorePaths.group)
                    .doc(roomId)
                    .collection(FirestorePaths.members).get()
                    .then(snapshot => {
                        snapshot.forEach(member => {
                            const reference = this.firestore.collection(FirestorePaths.users).doc(member.id);
                            return reference.get()
                                .then(document => {
                                    if (!document.exists) return;
                                    const user = plainToClass(User, document.data() as Object);
                                    
                                    payload.setAvatar(user.avatar)
                                    payload.setType(this.MESSAGE_GROUP)

                                    if (user.token && user.token.length > 0 && user.id !== message.idSender)
                                        this.fcm.sendToSingle(payload, user.token, reference);
                                });
                        });
                    })
            });
    }

    public startOnPrivateChat(): any {
        return functions.firestore
            .document(`${FirestorePaths.messagesPrivate}/{roomId}/${FirestorePaths.messages}/{messageId}`)
            .onCreate(event => {
                const roomId = event.params.roomId;
                const messageId = event.params.messageId;
                const message = plainToClass(Message, event.data.data() as Object)
                const payload = new FcmPayload(message);

                const reference = this.firestore.collection(FirestorePaths.users).doc(message.idReceiver);
                return reference.get()
                    .then(document => {
                        if (!document.exists) return;
                        const user = plainToClass(User, document.data() as Object);

                        payload.setAvatar(user.avatar)
                        payload.setType(this.MESSAGE_PRIVATE)

                        if (user.token && user.token.length > 0)
                            this.fcm.sendToSingle(payload, user.token, reference);
                    });
            });
    }
}