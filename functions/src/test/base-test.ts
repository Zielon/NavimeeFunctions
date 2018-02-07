import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

let config = null;

try {
    config = require('./google.json')
} catch (ex) {
    throw new Error("The file google.json is missing!")
}

export default class BaseTest {
    private firestore: any;

    constructor() {
        if (config === null) return;
        if (admin.apps.length === 0)
            admin.initializeApp({
                credential: admin.credential.cert(config)
            });

        this.firestore = admin.firestore();
    }

    public getFirestore(): any {
        return this.firestore;
    }
}
