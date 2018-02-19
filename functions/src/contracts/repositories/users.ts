import User from "../../models/entities/user";

export default interface IUsersRepository{
    getUser(id: string) : Promise<User>
}