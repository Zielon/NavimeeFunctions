import { Transform, classToPlain } from "class-transformer";
import { ISerializable } from "../../../contracts/serializable";

export default class Member implements ISerializable {
    public memberId: string;
    public notification: boolean;

    public serialize(): any {
        return classToPlain(this);
    }
}