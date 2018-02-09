import "reflect-metadata";
import * as admin from 'firebase-admin'
import { injectable, inject } from "inversify";
import TYPES from "../types";

import { IFcmSender } from "../contracts/fcm-sender";
import { FieldValue, DocumentReference } from "@google-cloud/firestore";
import FcmPayload from "../models/fcm-payload";

@injectable()
export default class FcmSender implements IFcmSender {

    public sendToSingle(payload: FcmPayload, token: string, document: DocumentReference): Promise<any> {
        return admin.messaging().sendToDevice(token, payload).then(response => {
            if (response.failureCount > 0)
                response.results.forEach((result, index) => {
                    const error = result.error;
                    if (error)
                        document.update({ token: FieldValue.delete() });
                });
        });
    };

    public sendToMany(payload: FcmPayload, tokens: string[]): Promise<any> {
        throw Error("Not implemeneted");
    };
}