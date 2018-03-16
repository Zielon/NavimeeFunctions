import "reflect-metadata";

import IUserAuth from "../contracts/services/user-auth";
import { injectable, inject } from "inversify";
import IUsersRepository from "../contracts/repositories/users";
import TYPES from "../types";
import * as functions from 'firebase-functions'

@injectable()
export default class UserAuth implements IUserAuth {

    @inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository;

    startOnAuthDeleteListener() {
        return functions.auth.user().onDelete(async (event) => {
                const firebaseUser = event.data;
                const rooms = await this.usersRepository.getRooms(firebaseUser.uid);
                const friends = await this.usersRepository.getFrineds(firebaseUser.uid);

                console.log(rooms);
                console.log(friends);
          });
    }

    startOnAuthCreateListener() {
        return functions.auth.user().onCreate((event) => {
            // TODO
        });
    }
}