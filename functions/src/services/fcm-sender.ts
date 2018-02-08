import * as admin from 'firebase-admin'

import { NotificationSender } from "../contracts/notification-sender";

export default class FcmSender implements NotificationSender {

    public sendToSingle(payload: admin.messaging.MessagingPayload, token: string): Promise<any>{
        return admin.messaging().sendToDevice(token, payload).then(response => {
            console.log(response);
        });
    };

    public sendToMany(payload: admin.messaging.MessagingPayload, tokens: string[]): Promise<any>{
        return admin.messaging().sendToDevice(tokens, payload).then(response => {
            console.log(response);
        });
    };
}