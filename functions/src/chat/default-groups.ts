// Add the default groups to a user during logging or registering 

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export default class CreateDefaultGroups {
    firestore: any;

    constructor() {
        if (admin.apps.length === 0)
            admin.initializeApp(functions.config().firebase);

        this.firestore = admin.firestore();
    }

    defaultGroup(): void {
        functions.firestore
            .document('USERS/{userId}')
            .onCreate(event => {
                const id = event.params.userId;
                const ref = this.firestore.collection('USERS').doc(id).collection('GROUP');

                // Drively team
                ref.doc().set({ roomId: '0' }).then(() => this.firestore.collection('GROUP').doc('0').collection('MEMBERS').doc(id).set({ memberId: id }));

                // General
                ref.doc().set({ roomId: '1' }).then(() => this.firestore.collection('GROUP').doc('1').collection('MEMBERS').doc(id).set({ memberId: id }));
            });
    }
}