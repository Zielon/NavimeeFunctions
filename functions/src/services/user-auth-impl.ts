import "reflect-metadata";

import IUserAuth from "../contracts/services/user-auth";
import { injectable, inject } from "inversify";
import IUsersRepository from "../contracts/repositories/users";
import TYPES from "../types";
import * as functions from 'firebase-functions'
import IChatRepository from "../contracts/repositories/chat";
import IEmailService from "../contracts/services/email-service";
import IStorageRepository from "../contracts/repositories/storage";
import IExpensesRepository from "../contracts/repositories/expenses";

@injectable()
export default class UserAuth implements IUserAuth {

    @inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository;
    @inject(TYPES.IChatRepository) private chatRepository: IChatRepository;
    @inject(TYPES.IStorageRepository) private storageRepository: IStorageRepository;
    @inject(TYPES.IEmailService) private emailServie: IEmailService;
    @inject(TYPES.IExpensesRepository) private expensesRepository: IExpensesRepository;

    public startOnAuthDeleteListener() {
        return functions.auth.user().onDelete(async (event) => {
            const userId = event.data.uid;
            const user = await this.usersRepository.getUser(userId);
            const rooms = await this.usersRepository.getRooms(userId);
            const friends = await this.usersRepository.getFrineds(userId);

            // Delete from every possible collections
            this.expensesRepository.deleteExpenses(user);
            this.chatRepository.deleteFromFriends(userId, friends);
            this.chatRepository.deleteFromGroup(user, rooms);
            this.chatRepository.deleteGroupMessages(user, rooms);
            this.chatRepository.deletePrivateMessages(user, friends);
            this.storageRepository.deleteFile(`AVATARS/${user.id}`).catch(error => console.log(error));
            this.usersRepository.deleteUser(userId);
        });
    }

    public startOnAuthCreateListener() {
        return functions.auth.user().onCreate(async (event) => {
            this.storageRepository.downloadFile("TEMPLATES/WELCOME.html").then(async file => {
                const template = file["0"].toString('utf8');
                const user = event.data;
                const mail = {
                    from: `Drively <${functions.config().gmail.email}>`,
                    to: user.email,
                    subject: 'Witamy na pokładzie',
                    html: template
                }
                this.emailServie.send(mail);
            });
        });
    }
}