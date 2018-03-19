import "reflect-metadata";
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { injectable, inject } from "inversify";
import FirestorePaths from "../consts/firestore-paths";
import { plainToClass } from "class-transformer";

import TYPES from "../types";
import IFirestore from "../contracts/services/firestore-service";
import IChatRepository from "../contracts/repositories/chat";
import Room from "../models/entities/chat/room";
import Member from "../models/entities/chat/member";
import User from "../models/entities/user";
import { WriteResult } from "@google-cloud/firestore";
import { isNullOrUndefined } from "util";

@injectable()
export default class ChatRepository implements IChatRepository {

    @inject(TYPES.IFirestore) private firestore: IFirestore;

    public async getRoom(id: string, country: string): Promise<Room> {
        return new Promise<Room>(async (resolve, reject) => {
            const ref = this.firestore.getFirestore()
                .collection(FirestorePaths.group)
                .doc(country)
                .collection(id)
                .doc(FirestorePaths.roomDetails);

            const room = await ref.get();

            if (!room.exists) reject(`Room ${id} in country ${country} does not exist`);

            const result = plainToClass(Room, room.data() as Object)
            result.members = new Array<Member>();
            const members = await ref.collection(FirestorePaths.members).get();
            members.forEach(member => {
                try {
                    result.members.push(plainToClass(Member, member.data() as Object))
                } catch (error) {/* ignore */ }
            });
            resolve(result);
        });
    }

    public async getRooms(country: string): Promise<Array<Room>> {
        return new Promise<Array<Room>>(async (resolve, reject) => {
            const ref = this.firestore.getFirestore()
                .collection(FirestorePaths.group)
                .doc(country);

            const collections = await ref.getCollections();
            const promises = collections.map(async collection => {
                return new Promise<Room>(async (roomResolve) => {
                    const room = await ref.collection(collection.id).doc(FirestorePaths.roomDetails).get();
                    roomResolve(plainToClass(Room, room.data() as Object));
                });
            });

            return Promise.all(promises).then(rooms => {
                resolve(rooms.filter(room => !isNullOrUndefined(room)));
            });
        });
    }

    public async addMember(roomId: string, user: User): Promise<WriteResult> {
        const member = new Member();
        member.memberId = user.id;
        member.notification = true;

        return this.firestore.getFirestore()
            .collection(FirestorePaths.group)
            .doc(user.country)
            .collection(roomId)
            .doc(FirestorePaths.roomDetails)
            .collection(FirestorePaths.members)
            .doc(user.id).set(member.serialize());
    }

    public async deleteFromGroup(user: User, groups: Array<string>): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            const promises = groups.map(group => {
                return this.firestore.getFirestore()
                    .collection(FirestorePaths.group)
                    .doc(user.country)
                    .collection(group)
                    .doc(FirestorePaths.roomDetails)
                    .collection(FirestorePaths.members)
                    .doc(user.id).delete();
            });
            resolve();
        });
    }

    public async deleteGroupMessages(user: User, groups: string[]): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            groups.forEach(async group => {

                const messanges = await this.firestore.getFirestore()
                    .collection(FirestorePaths.messagesGroups)
                    .doc(user.country)
                    .collection(group)
                    .where('idSender', '==', user.id).get();

                messanges.forEach(async message => {
                    this.firestore.getFirestore()
                        .collection(FirestorePaths.messagesGroups)
                        .doc(user.country)
                        .collection(group)
                        .doc(message.id).update({ deleted: true })
                });
            });
            resolve();
        });
    }

    public async deletePrivateMessages(user: User, friends: string[]): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            const promises = friends.map(friend => {
                const collection = user.id.localeCompare(friend) > 0 ? friend + "|" + user.id : user.id + "|" + friend;
                console.log(collection);
                return this.firestore.deleteCollection(`${FirestorePaths.messagesPrivate}/${user.country}/${collection}`);
            });
            resolve();
        });
    }

    public async deleteFromFriends(userId: string, friends: Array<string>): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            const promises = friends.map(friend => {
                return this.firestore.getFirestore()
                    .collection(FirestorePaths.users)
                    .doc(friend)
                    .collection(FirestorePaths.friends)
                    .doc(userId).delete();
            });
            resolve();
        });
    }
}