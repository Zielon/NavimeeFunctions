import * as admin from 'firebase-admin'
import { classToPlain } from "class-transformer";
import { ISerializable } from "../contracts/serializable";
import Message from './entities/message';

export default class FcmPayload implements ISerializable {
    private data: any[];

    constructor(...data: any[]) {
        this.data = data;
    }

    public serialize(): any {
        return {
            data: this.data.reduce((prev, curr) => Object.assign(prev, classToPlain(curr)), {})
        };
    }
}