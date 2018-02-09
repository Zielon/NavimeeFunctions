import { classToPlain } from "class-transformer";
import { ISerializable } from '../contracts/serializable';

export default class SlackFields implements ISerializable {
    title: string;
    short: boolean;
    value: string;

    constructor() {
        this.short = false;
        this.title = 'Application';
        this.value = process.env.GCLOUD_PROJECT;
    }

    public serialize(): any {
        return classToPlain(this);
    }
}