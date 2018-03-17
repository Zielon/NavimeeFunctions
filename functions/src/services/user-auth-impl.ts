import "reflect-metadata";

import IUserAuth from "../contracts/services/user-auth";
import { injectable, inject } from "inversify";
import IUsersRepository from "../contracts/repositories/users";
import TYPES from "../types";
import * as functions from 'firebase-functions'
import IChatRepository from "../contracts/repositories/chat";

@injectable()
export default class UserAuth implements IUserAuth {

    @inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository;
    @inject(TYPES.IChatRepository) private chatRepository: IChatRepository;

    startOnAuthDeleteListener() {
        return functions.auth.user().onDelete(async (event) => {
            const userId = event.data.uid;
            const user = await this.usersRepository.getUser(userId);
            const rooms = await this.usersRepository.getRooms(userId);
            const friends = await this.usersRepository.getFrineds(userId);

            // Delete from every possible collections
            this.chatRepository.deleteFromFriends(userId, friends);
            this.chatRepository.deleteFromGroup(user, rooms);
            this.chatRepository.deleteGroupMessages(user, rooms);
            this.chatRepository.deletePrivateMessages(user, friends);
            this.usersRepository.deleteUser(userId);
        });
    }

    startOnAuthCreateListener() {
        return functions.auth.user().onCreate((event) => {
            // TODO
        });
    }
}