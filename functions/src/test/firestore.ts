import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

let config = null;

try {
    config = require('./google.json')
} catch (ex) {
    throw new Error("The file google.json is missing!")
}

export default class FirestoreBase {
    private static firestore = null;

    public static initFirestore(): void {
        if (admin.apps.length === 0 && FirestoreBase.firestore === null) {
            admin.initializeApp({
                credential: admin.credential.cert(config)
            });
            FirestoreBase.firestore = admin.firestore();
        }
    }

    public static getFirestore(): any {
        if (FirestoreBase.firestore === null)
            FirestoreBase.initFirestore();

        return FirestoreBase.firestore;
    }
}
