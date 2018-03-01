import { classToPlain, Expose } from "class-transformer";
import { ISerializable } from '../contracts/serializable';
import SlackFields from './slack-fields';
import * as moment from 'moment';

export default class SlackMessage implements ISerializable {
    text: string;
    color: string;
    fields: [SlackFields];
    footer: string;
    ts: Number;

    @Expose({ name: "author_name" })
    author: string;

    constructor(text: string, author: string) {
        this.color = "#E40455";
        this.text = text;
        this.fields = [new SlackFields()];
        this.ts = moment().unix();
        this.footer = `Drively Chat`;
        this.author = `Author: ${author}`;
    }

    public serialize(): any {
        return classToPlain(this);
    }
}