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
                const payload = {
                    notification: {
                        title: `${message.nameSender} sends you a message!`,
                        body: message.text,
                    }
                };

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