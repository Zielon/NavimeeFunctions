import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import FcmSender from '../services/fcm-sender'
import FirestorePaths from '../consts/firestore-paths'

export default class ChatFcm {
    private firestore: any;
    private fcm: FcmSender;

    constructor() {
        if (admin.apps.length === 0)
            admin.initializeApp(functions.config().firebase);

        this.firestore = admin.firestore();
        this.fcm = new FcmSender();
    }

    public startOnGroupChat(): any {
        return functions.firestore
            .document(`${FirestorePaths.messagesGroups}/{roomId}/${FirestorePaths.messages}/{messageId}`)
            .onWrite(event => {
                const roomId = event.params.roomId;
                const messageId = event.params.messageId;
                const message = event.data.data();
                const payload = {
                    notification: {
                        title: `${message.nameSender} sends you a message!`,
                        body: message.text,
                    }
                };

                this.firestore.collection(FirestorePaths.group)
                    .doc(roomId)
                    .collection(FirestorePaths.members).get()
                    .then(snapshot => {
                        snapshot.forEach(member => {
                            this.firestore.collection(FirestorePaths.users).doc(member.id).get()
                                .then(document => {
                                    if (!document.exists) return;
                                    let user = document.data();
                                    if (user.token && user.id !== message.idSender)
                                        this.fcm.sendToSingle(payload, user.token, document);
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
                const payload = {
                    notification: {
                        title: `${message.nameSender} sends you a message!`,
                        body: message.text,
                    }
                };

                this.firestore.collection(FirestorePaths.users).doc(message.idReceiver).get()
                    .then(document => {
                        if (!document.exists) return;
                        let user = document.data();
                        if (user.token)
                            this.fcm.sendToSingle(payload, user.token, document);
                    })
            });
    }
}