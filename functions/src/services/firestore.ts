import "reflect-metadata";
import IFirestore from "../contracts/services/firestore-service";
import * as admin from 'firebase-admin'
import { injectable, inject } from "inversify";
import * as functions from 'firebase-functions'

@injectable()
export default class FirestoreService implements IFirestore {
    get() : any {
        if (admin.apps.length === 0)
            admin.initializeApp(functions.config().firebase);
        return admin.firestore();
    }
}