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

@injectable()
export default class ChatRepository implements IChatRepository {

    @inject(TYPES.IFirestore) private firestore: IFirestore;

    public async getRoom(id: string): Promise<Room> {
        return new Promise<Room>(async (resolve, reject) => {
            const ref = this.firestore.get()
                .collection(FirestorePaths.group)
                .doc(FirestorePaths.country)
                .collection(id)
                .doc(FirestorePaths.roomDetails);

            const room = await ref.get();

            if (!room.exists) reject();

            const result = plainToClass(Room, room.data() as Object)
            result.members = new Array<Member>();
            const members = await ref.collection(FirestorePaths.members).get();
            members.forEach(member => result.members.push(plainToClass(Member, member.data() as Object)));

            resolve(result);
        });
    }

    public async getRooms(): Promise<Array<Room>> {
        return new Promise<Array<Room>>(async (resolve, reject) => {
            const ref = this.firestore.get()
                .collection(FirestorePaths.group)
                .doc(FirestorePaths.country);

            const rooms = await ref.getCollections();
            const result = new Array<Room>();

            rooms.forEach(async collection => {
                const room = await ref.collection(collection.id).doc(FirestorePaths.roomDetails).get();
                if (!room.exists) reject();
                result.push(plainToClass(Room, room.data() as Object));
            });

            resolve(result);
        });
    }

    public async addMember(roomId: string, user: User): Promise<void> {
        const member = new Member();
        member.memberId = user.id;
        member.notification = true;

        return this.firestore.get()
            .collection(FirestorePaths.group)
            .doc(user.country)
            .collection(roomId)
            .doc(FirestorePaths.roomDetails)
            .collection(FirestorePaths.members)
            .doc(user.id).set(member.serialize());
    }
}