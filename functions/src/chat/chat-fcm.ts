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
                        title: 'Test',
                        body: message.text,
                    }
                };

                this.firestore.collection(FirestorePaths.group)
                    .doc(roomId)
                    .collection(FirestorePaths.members).get()
                    .then(snapshot => {
                        snapshot.forEach((doc) => {
                            this.firestore.collection(FirestorePaths.users).doc(doc.id).get()
                                .then(user => {
                                    if (user.data().token)
                                        this.fcm.sendToSingle(payload, user.data().token);
                                })
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
                        title: 'Test',
                        body: message.text,
                    }
                };

                this.firestore.collection(FirestorePaths.users).doc(message.idReceiver).get()
                    .then(user => {
                        if (user.data().token)
                            this.fcm.sendToSingle(payload, user.data().token);
                    })
            });
    }
}