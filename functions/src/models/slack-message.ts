import { classToPlain, Expose } from "class-transformer";
import { ISerializable } from '../contracts/serializable';
import SlackFields from './slack-fields';

export default class SlackMessage implements ISerializable {
    text: string;
    color: string;
    fields: [SlackFields];
    ts: number;
    footer: string;

    @Expose({ name: "author_name" })
    author: string;

    constructor(text: string, author: string, date: number, documentId: string) {
        this.color = "#E40455";
        this.text = text;
        this.fields = [new SlackFields()];
        this.ts = date;
        this.footer = `Drively Chat [${documentId}]`;
        this.author = `Author: ${author}`;
    }

    public serialize(): any {
        return classToPlain(this);
    }
}