import { ISerializable } from "../contracts/serializable";

export interface ISlackSender{
    send<T extends ISerializable>(message: T): Promise<any>
}