import { Transform, classToPlain } from "class-transformer";
import { ISerializable } from "../../../contracts/serializable";
import Member from "./member";

export default class Room implements ISerializable {
    public admin: string;
    public name: string;
    public id: string;
    public editable: boolean;
    public members: Array<Member>;

    public serialize(): any {
        return classToPlain(this);
    }
}