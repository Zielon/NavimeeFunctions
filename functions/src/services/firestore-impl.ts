import "reflect-metadata";
import IFirestore from "../contracts/services/firestore-service";
import * as admin from 'firebase-admin'
import { injectable, inject } from "inversify";
import * as functions from 'firebase-functions'
import { Firestore } from "@google-cloud/firestore";

@injectable()
export default class FirestoreService implements IFirestore {
    public getFirestore(): Firestore {
        let referenece = null;
        try {
            referenece = admin.firestore();
        } catch (error) {
            admin.initializeApp(functions.config().firebase);
            referenece = admin.firestore();
        }
        return referenece;
    }

    public async deleteCollection(collectionPath: string): Promise<void> {
        const query = this.getFirestore().collection(collectionPath).orderBy('__name__');
        return new Promise<void>((resolve, reject) => {
            this.deleteQueryBatch(this.getFirestore(), query, resolve, reject);
        });
    }

    private deleteQueryBatch(db, query, resolve, reject) {
        query.get()
            .then((snapshot) => {
                // When there are no documents left, we are done
                if (snapshot.size === 0) {
                    return 0;
                }

                // Delete documents in a batch
                const batch = db.batch();
                snapshot.docs.forEach((doc) => {
                    batch.delete(doc.ref);
                });

                return batch.commit().then(() => {
                    return snapshot.size;
                });
            }).then((numDeleted) => {
                if (numDeleted === 0) {
                    resolve();
                    return;
                }

                // Recurse on the next process tick, to avoid
                // exploding the stack.
                process.nextTick(() => {
                    this.deleteQueryBatch(db, query, resolve, reject);
                });
            })
            .catch(reject);
    }
}