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

                return this.firestore.collection(FirestorePaths.group).doc(roomId)
                    .collection(FirestorePaths.members).get()
                    .then(members => {
                        return this.firestore.collection(FirestorePaths.users).doc(message.idSender).get()
                            .then(snederDocument => {
                                const sender = plainToClass(User, snederDocument.data() as Object);

                                members.forEach(member => {
                                    const reference = this.firestore.collection(FirestorePaths.users).doc(member.id);
                                    return reference.get()
                                        .then(receiverDocument => {
                                            if (!receiverDocument.exists) return;
                                            const receiver = plainToClass(User, receiverDocument.data() as Object);
                                            const payload = new FcmPayload(message, { avatar: sender.avatar, type: this.MESSAGE_GROUP });

                                            if (receiver.token && receiver.token.length > 0 && receiver.id !== sender.id)
                                                this.fcm.sendToSingle(payload, receiver.token, reference);
                                        });
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

                return this.firestore.collection(FirestorePaths.users).doc(message.idSender).get()
                    .then(snederDocument => {
                        const sender = plainToClass(User, snederDocument.data() as Object);

                        const reference = this.firestore.collection(FirestorePaths.users).doc(message.idReceiver);
                        return reference.get()
                            .then(receiverDocument => {
                                if (!receiverDocument.exists) return;

                                const receiver = plainToClass(User, receiverDocument.data() as Object);
                                const payload = new FcmPayload(message, { avatar: sender.avatar, type: this.MESSAGE_PRIVATE });

                                if (receiver.token && receiver.token.length > 0)
                                    this.fcm.sendToSingle(payload, receiver.token, reference);
                            });
                    });
            });
    }
}