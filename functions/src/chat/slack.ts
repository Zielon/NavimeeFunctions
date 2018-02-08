import * as rp from 'request-promise'
import { Serializable } from "../contracts/serializable";

// Sends messages to the Slack comunicator.
export default class Slack {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    send<T extends Serializable>(message: T): Promise<any> {
        return rp({
            method: 'POST',
            uri: this.url,
            body: {
                attachments: [
                    message.serialize()
                ]
            },
            json: true
        })
    }
}