import "reflect-metadata";
import * as admin from 'firebase-admin'
import { injectable, inject } from "inversify";
import TYPES from "../types";

import { IFcmService } from "../contracts/services/fcm-sender";
import { FieldValue, DocumentReference } from "@google-cloud/firestore";
import { ISerializable } from "../contracts/serializable";

@injectable()
export default class FcmService implements IFcmService {

    public sendToSingle<T extends ISerializable>(payload: T, token: string, document: DocumentReference): Promise<any> {
        return admin.messaging().sendToDevice(token, payload.serialize()).then(response => {
            if (response.failureCount > 0)
                response.results.forEach((result, index) => {
                    console.log(result.error);
                });
        });
    };

    public sendToMany<T extends ISerializable>(payload: T, tokens: string[]): Promise<any> {
        throw Error("Not implemeneted");
    };
}