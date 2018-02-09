import * as admin from 'firebase-admin'
import { DocumentReference } from "@google-cloud/firestore";
import FcmPayload from "../models/fcm-payload";

export interface IFcmSender {
    sendToSingle: (payload: FcmPayload, token: string, document: DocumentReference) => Promise<void>;
    sendToMany: (payload: FcmPayload, tokens: Array<string>) => Promise<void>;
}