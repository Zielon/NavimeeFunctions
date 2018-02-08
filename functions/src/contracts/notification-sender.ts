import * as admin from 'firebase-admin'
import { DocumentReference } from "@google-cloud/firestore";

export interface NotificationSender {
    sendToSingle: (payload: admin.messaging.MessagingPayload, token: string, document: DocumentReference) => Promise<void>;
    sendToMany: (payload: admin.messaging.MessagingPayload, tokens: Array<string>) => Promise<void>;
}