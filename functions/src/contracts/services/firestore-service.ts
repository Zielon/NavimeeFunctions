import { Firestore } from "@google-cloud/firestore";
import * as functions from 'firebase-functions'

export default interface IFirestore {
    getFirestore(): Firestore;
    deleteCollection(collectionPath: string): Promise<void>
}