import "reflect-metadata";
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { injectable, inject } from "inversify";
import { plainToClass } from "class-transformer";

import TYPES from "../types";
import FirestorePaths from '../consts/firestore-paths'
import { IChatNotifier } from "../contracts/services/chat-notifier";
import { IFcmService } from "../contracts/services/fcm-sender";
import FcmPayload from "../models/fcm-payload";
import Message from "../models/entities/message";
import User from "../models/entities/user";
import IUsersRepository from "../contracts/repositories/users";
import IFirestore from "../contracts/services/firestore-service";
import IChatRepository from "../contracts/repositories/chat";

@injectable()
export default class ChatNotifier implements IChatNotifier {
    @inject(TYPES.IFcmService) private fcmService: IFcmService;
    @inject(TYPES.IFirestore) private firestore: IFirestore;
    @inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository;
    @inject(TYPES.IChatRepository) private chatRepository: IChatRepository;

    private readonly MESSAGE_PRIVATE_TYPE = "MESSAGE_PRIVATE";
    private readonly MESSAGE_GROUP_TYPE = "MESSAGE_GROUP";

    public startOnGroupChat(): any {
        return functions.firestore
            .document(`${FirestorePaths.messagesGroups}/{country}/{roomId}/{messageId}`)
            .onCreate(async event => {
                const roomId = event.params.roomId;
                const messageId = event.params.messageId;
                const message = plainToClass(Message, event.data.data() as Object)

                const room = await this.chatRepository.getRoom(roomId);
                const sender = await this.usersRepository.getUser(message.idSender);

                room.members.forEach(async member => {
                    const reference = this.firestore.get().collection(FirestorePaths.users).doc(member.memberId);
                    const receiver = await this.usersRepository.getUser(member.memberId);
                    const payload = new FcmPayload(message, { avatar: sender.avatar, type: this.MESSAGE_GROUP_TYPE });

                    if (receiver.token && receiver.token.length > 0 && receiver.id !== sender.id)
                        this.fcmService.sendToSingle(payload, receiver.token, reference);
                });
            });
    }

    public startOnPrivateChat(): any {
        return functions.firestore
            .document(`${FirestorePaths.messagesPrivate}/{country}/{roomId}/{messageId}`)
            .onCreate(async event => {
                const roomId = event.params.roomId;
                const messageId = event.params.messageId;
                const message = plainToClass(Message, event.data.data() as Object)

                const reference = this.firestore.get().collection(FirestorePaths.users).doc(message.idReceiver);
                const sender = await this.usersRepository.getUser(message.idSender);
                const receiver = await this.usersRepository.getUser(message.idReceiver);
                const payload = new FcmPayload(message, { avatar: sender.avatar, type: this.MESSAGE_PRIVATE_TYPE });

                if (receiver.token && receiver.token.length > 0)
                    this.fcmService.sendToSingle(payload, receiver.token, reference);
            });
    }
}