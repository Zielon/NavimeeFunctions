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
import { WriteResult } from "@google-cloud/firestore";

@injectable()
export default class UsersRepository implements IUsersRepository {

    @inject(TYPES.IFirestore) private firestore: IFirestore;

    public getRooms(id: string): Promise<string[]> {
        return new Promise<string[]>(async (resolve, reject) => {
            const groups = await this.firestore.getFirestore()
                .collection(FirestorePaths.users)
                .doc(id)
                .collection(FirestorePaths.group).get();
            const result = new Array<string>();
            groups.forEach(group => result.push(group.id));
            resolve(result);
        });
    }

    public getFrineds(id: string): Promise<string[]> {
        return new Promise<string[]>(async (resolve, reject) => {
            const friends = await this.firestore.getFirestore()
                .collection(FirestorePaths.users)
                .doc(id)
                .collection(FirestorePaths.friends).get();
            const result = new Array<string>();
            friends.forEach(friend => result.push(friend.id));
            resolve(result);
        });
    }

    public async getUser(id: string): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {
            const user = await this.firestore.getFirestore().collection(FirestorePaths.users).doc(id).get();
            if (!user.exists) reject();
            resolve(plainToClass(User, user.data() as Object));
        });
    }

    public async addRoom(userId: string, roomId: string): Promise<WriteResult> {
        return this.firestore.getFirestore()
            .collection(FirestorePaths.users)
            .doc(userId)
            .collection(FirestorePaths.group)
            .doc(roomId).set({ roomId: roomId });
    }

    public async deleteUser(id: string): Promise<WriteResult> {
        this.firestore.deleteCollection(`${FirestorePaths.users}/${id}/${FirestorePaths.group}`)
        this.firestore.deleteCollection(`${FirestorePaths.users}/${id}/${FirestorePaths.friends}`)
        return this.firestore.getFirestore()
            .collection(FirestorePaths.users)
            .doc(id).delete();
    }
}