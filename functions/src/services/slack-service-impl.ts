import "reflect-metadata";
import * as rp from 'request-promise'
import { injectable } from "inversify";

import { ISerializable } from "../contracts/serializable";
import { ISlackService } from "../contracts/services/slack-service"

@injectable()
export default class SlackService implements ISlackService {
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