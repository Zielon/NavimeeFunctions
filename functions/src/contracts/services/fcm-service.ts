import * as admin from 'firebase-admin'
import { DocumentReference } from "@google-cloud/firestore";
import { ISerializable } from "../serializable";

export default interface IFcmService {
    sendToSingle<T extends ISerializable>(payload: T, token: string): Promise<void>;
    sendToTopic<T extends ISerializable>(payload: T, topic: string): Promise<void>;
}