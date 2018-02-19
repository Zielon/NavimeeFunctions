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

@injectable()
export default class ChatRepository implements IChatRepository {

    @inject(TYPES.IFirestore) private firestore: IFirestore;

    public async getRoom(id: string): Promise<Room> {
        return new Promise<Room>(async (resolve, reject) => {
            const ref = this.firestore.get()
                .collection(FirestorePaths.users)
                .doc(FirestorePaths.country)
                .collection(id)
                .doc(FirestorePaths.roomDetails);

            const room = await ref.get();

            if (!room.exists) reject();

            const members = await ref.collection(FirestorePaths.members).get();
            const result = plainToClass(Room, room.data() as Object)
            result.members = members.map(member => plainToClass(Member, member.data() as Object));

            resolve(result);
        });
    }
}