import { classToPlain, Expose } from "class-transformer";
import { Serializable } from '../contracts/serializable';

export default class SlackFields implements Serializable {
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