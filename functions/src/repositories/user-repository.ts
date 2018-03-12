import "reflect-metadata";
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { injectable, inject } from "inversify";
import FirestorePaths from "../consts/firestore-paths";
import { plainToClass } from "class-transformer";

import IUsersRepository from "../contracts/repositories/users";
import User from "../models/entities/user";
import TYPES from "../types";
import IFirestore from "../contracts/services/firestore-service";

@injectable()
export default class UsersRepository implements IUsersRepository {

    @inject(TYPES.IFirestore) private firestore: IFirestore;

    public async getUser(id: string): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {
            const user = await this.firestore.getFirestore().collection(FirestorePaths.users).doc(id).get();
            if (!user.exists) reject();
            resolve(plainToClass(User, user.data() as Object));
        });
    }

    public async addRoom(userId: string, roomId: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            return this.firestore.getFirestore()
                .collection(FirestorePaths.users)
                .doc(userId)
                .collection(FirestorePaths.group)
                .doc(roomId).set({ roomId: roomId });
        });
    }
}