import "reflect-metadata";
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { injectable, inject } from "inversify";
import { plainToClass } from "class-transformer";

import TYPES from "../types";
import FirestorePaths from '../consts/firestore-paths'
import { IChatNotifier } from "../contracts/services/chat-notifier";
import { IFcmService } from "../contracts/services/fcm-service";
import FcmPayload from "../models/fcm-payload";
import Message from "../models/entities/message";
import User from "../models/entities/user";
import IUsersRepository from "../contracts/repositories/users";
import IFirestore from "../contracts/services/firestore-service";
import IChatRepository from "../contracts/repositories/chat";
import FcmTypes from "../consts/fcm-types";

@injectable()
export default class ChatNotifier implements IChatNotifier {
    @inject(TYPES.IFcmService) private fcmService: IFcmService;
    @inject(TYPES.IFirestore) private firestore: IFirestore;
    @inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository;
    @inject(TYPES.IChatRepository) private chatRepository: IChatRepository;

    public startOnGroupChat(): any {
        return functions.firestore
            .document(`${FirestorePaths.messagesGroups}/{country}/{roomId}/{messageId}`)
            .onCreate(async event => {
                const roomId = event.params.roomId as String;
                const messageId = event.params.messageId;
                const message = plainToClass(Message, event.data.data() as Object)

                const room = await this.chatRepository.getRoom(roomId.toUpperCase());
                const sender = await this.usersRepository.getUser(message.idSender);

                room.members.forEach(async member => {
                    const receiver = await this.usersRepository.getUser(member.memberId);
                    const payload = new FcmPayload(message, { avatar: sender.avatar, type: FcmTypes.MESSAGE_GROUP_TYPE, roomName: room.name});

                    if (receiver.token && receiver.token.length > 0 && receiver.id !== sender.id && receiver.chatGroupNotification)
                        this.fcmService.sendToSingle(payload, receiver.token);
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

                const sender = await this.usersRepository.getUser(message.idSender);
                const receiver = await this.usersRepository.getUser(message.idReceiver);
                const payload = new FcmPayload(message, { avatar: sender.avatar, type: FcmTypes.MESSAGE_PRIVATE_TYPE });

                if (receiver.token && receiver.token.length > 0 && receiver.chatPrivateNotification)
                    this.fcmService.sendToSingle(payload, receiver.token);
            });
    }
}