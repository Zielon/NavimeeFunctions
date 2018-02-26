import { ISerializable } from "../serializable";

export interface ISlackService{
    send<T extends ISerializable>(message: T): Promise<any>
}