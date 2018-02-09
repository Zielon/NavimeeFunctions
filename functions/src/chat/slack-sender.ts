import "reflect-metadata";
import * as rp from 'request-promise'
import { injectable } from "inversify";

import { ISerializable } from "../contracts/serializable";
import { ISlackSender } from "../contracts/slack-sender"

@injectable()
export default class SlackSender implements ISlackSender {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    send<T extends ISerializable>(message: T): Promise<any> {
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