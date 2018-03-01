import { ISerializable } from "../serializable";
import SlackChannel from "../../models/slack-channel";

export default interface ISlackService {
    send<T extends ISerializable>(message: T, url: string): Promise<any>;
    startOnRequestListener(slackChannel: SlackChannel): any;
    startOnDocumentListener(slackChannel: SlackChannel): any;
}