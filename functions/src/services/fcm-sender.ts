import * as admin from 'firebase-admin'

import { NotificationSender } from "../contracts/notification-sender";
import { FieldValue, DocumentReference } from "@google-cloud/firestore";

export default class FcmSender implements NotificationSender {

    public sendToSingle(payload: admin.messaging.MessagingPayload, token: string, document: DocumentReference): Promise<any> {
        return admin.messaging().sendToDevice(token, payload).then(response => {
            if (response.failureCount > 0)
                response.results.forEach((result, index) => {
                    const error = result.error;
                    if (error)
                        document.update({ token: FieldValue.delete() });
                });
        });
    };

    public sendToMany(payload: admin.messaging.MessagingPayload, tokens: string[]): Promise<any> {
        throw Error("Not implemeneted");
        //        return admin.messaging().sendToDevice(tokens, payload).then(response => {
        //
        //        });
    };
}