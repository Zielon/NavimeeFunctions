import "reflect-metadata";
import * as admin from 'firebase-admin'
import { injectable, inject } from "inversify";
import TYPES from "../types";

import IFcmService from "../contracts/services/fcm-service";
import { FieldValue, DocumentReference } from "@google-cloud/firestore";
import { ISerializable } from "../contracts/serializable";

@injectable()
export default class FcmService implements IFcmService {

    public sendToDevice<T extends ISerializable>(payload: T, token: string): Promise<any> {
        return admin.messaging().sendToDevice(token, payload.serialize()).then(response => {
            if (response.failureCount > 0)
                response.results.forEach((result, index) => {
                    console.log(result.error);
                });
        });
    };

    public sendToTopic<T extends ISerializable>(payload: T, topic:string): Promise<any> {
        return admin.messaging().sendToTopic(topic, payload.serialize());
    };
}