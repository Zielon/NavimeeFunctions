"use strict";
// Add the default groups to a user during logging or registering 
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
class CreateDefaultGroups {
    constructor() {
        if (admin.apps.length === 0)
            admin.initializeApp(functions.config().firebase);
        this.firestore = admin.firestore();
    }
    defaultGroup() {
        return functions.firestore
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
exports.default = CreateDefaultGroups;
//# sourceMappingURL=default-groups.js.map