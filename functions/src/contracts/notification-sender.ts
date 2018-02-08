import * as admin from 'firebase-admin'

export interface NotificationSender {
    sendToSingle: (payload: admin.messaging.MessagingPayload, token: string) => Promise<void>;
    sendToMany: (payload: admin.messaging.MessagingPayload, tokens: Array<string>) => Promise<void>;
}