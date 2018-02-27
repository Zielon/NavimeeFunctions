// Add the default groups to a user during logging or registering 

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import User from '../models/entities/user';
import { plainToClass } from 'class-transformer';
import Member from '../models/entities/chat/member';
import FirestorePaths from '../consts/firestore-paths';

export default class CreateDefaultGroups {
    private firestore: any;

    constructor() {
        if (admin.apps.length === 0)
            admin.initializeApp(functions.config().firebase);

        this.firestore = admin.firestore();
    }

    public defaultGroup(): any {
        return functions.firestore
            .document('USERS/{userId}')
            .onWrite(event => {
                const id = event.params.userId;
                const user = plainToClass(User, event.data.data() as Object)

                const member = new Member();
                member.memberId = user.id;

                const ref = this.firestore.collection('USERS').doc(user.id).collection('GROUP');

                ['DRIVELY', 'OGÓLNY', user.city].forEach(chat => {
                    ref.doc(chat).set({ roomId: chat }).then(() =>
                        this.firestore.collection(FirestorePaths.group)
                            .doc(user.country)
                            .collection(chat)
                            .doc(FirestorePaths.roomDetails)
                            .collection(FirestorePaths.members)
                            .doc(user.id).set(member.serialize()));
                });

                return null;
            });
    }
}