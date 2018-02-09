import * as admin from 'firebase-admin'

export default class FcmPayload {
    [key: string]: string;
    constructor(text: string, type: string, idSender: string){
        this['text'] = text;
        this['type'] = type;
        this['idSender'] = idSender;
    }
}