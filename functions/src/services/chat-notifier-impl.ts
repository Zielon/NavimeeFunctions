import "reflect-metadata";
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { injectable, inject } from "inversify";
import { plainToClass } from "class-transformer";

import TYPES from "../types";
import FirestorePaths from '../consts/firestore-paths'
import IChatNotifier from "../contracts/services/chat-notifier";
import IFcmService from "../contracts/services/fcm-service";
import FcmPayload from "../models/fcm-payload";
import Message from "../models/entities/message";
import User from "../models/entities/user";
import IUsersRepository from "../contracts/repositories/users";
import IFirestore from "../contracts/services/firestore-service";
import IChatRepository from "../contracts/repositories/chat";
import FcmTypes from "../consts/fcm-types";
import Member from "../models/entities/chat/member";
import ChatCountryFilters from "../consts/chat-filters";
import { resolve } from "url";

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
                const roomId = event.params.roomId as string;
                const messageId = event.params.messageId;
                const message = plainToClass(Message, event.data.data() as Object)
                const sender = await this.usersRepository.getUser(message.idSender);
                const room = await this.chatRepository.getRoom(roomId, sender);

                room.members.forEach(async member => {
                    new Promise<void>(async (success, failure) => {
                        const receiver = await this.usersRepository.getUser(member.memberId);
                        const payload = new FcmPayload(message, { avatar: sender.avatar, type: FcmTypes.MESSAGE_GROUP_TYPE, roomName: room.name });
                        if (receiver.token && receiver.token.length > 0 && receiver.id !== sender.id && receiver.chatGroupNotification)
                            this.fcmService.sendToSingle(payload, receiver.token).then(() => success()).catch(() => failure());
                    })
                });

                return null;
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

                return null;
            });
    }

    public createDefaultGroups(): any {
        return functions.firestore
            .document('USERS/{userId}')
            .onWrite(async event => {
                const id = event.params.userId;
                const user = plainToClass(User, event.data.data() as Object)

                const defaults = ['DRIVELY', 'OGOLNY'];
                const rooms = await this.chatRepository.getRooms(user.country);

                const cityFilter = new ChatCountryFilters().getFilter(user.country, user.city);
                const room = rooms.filter(cityFilter);

                // Each city has it's own channle to advertisements.
                if (room.length > 0) {
                    const roomId = room.shift().id.trim();
                    defaults.push(roomId)
                    defaults.push(roomId + '_OFERTY')
                }

                defaults.forEach(roomId => {
                    this.usersRepository.addRoom(user.id, roomId)
                    this.chatRepository.addMember(roomId, user);
                });

                return null;
            });
    }
}