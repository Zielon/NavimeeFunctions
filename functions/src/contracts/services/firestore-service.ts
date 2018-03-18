import { Firestore } from "@google-cloud/firestore";
import * as functions from 'firebase-functions'
import { Bucket } from "@google-cloud/storage";

export default interface IFirestore {
    getFirestore(): Firestore;
    getBucket(): Bucket;
    deleteCollection(collectionPath: string): Promise<void>
}