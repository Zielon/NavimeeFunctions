import "reflect-metadata";
import IFirestore from "../contracts/services/firestore-service";
import * as admin from 'firebase-admin'
import { injectable, inject } from "inversify";
import * as functions from 'firebase-functions'
import { Firestore } from "@google-cloud/firestore";

@injectable()
export default class FirestoreService implements IFirestore {
    public getFirestore() : Firestore {
        let referenece = null;
        try {
            referenece = admin.firestore();
        } catch (error) {
            admin.initializeApp(functions.config().firebase);
            referenece = admin.firestore();
        }
        return referenece;
    }
}