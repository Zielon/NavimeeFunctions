import * as admin from 'firebase-admin'
import { DocumentReference } from "@google-cloud/firestore";
import FcmPayload from "../models/fcm-payload";
import { ISerializable } from "./serializable";

export interface IFcmSender {
    sendToSingle<T extends ISerializable>(payload: T, token: string, document: DocumentReference): Promise<void>;
    sendToMany<T extends ISerializable>(payload: T, tokens: Array<string>): Promise<void>;
}