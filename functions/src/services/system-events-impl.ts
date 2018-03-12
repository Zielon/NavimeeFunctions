import "reflect-metadata";
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { inject, injectable } from "inversify";
import TYPES from "../types";
import IFcmService from "../contracts/services/fcm-service";
import FcmPayload from "../models/fcm-payload";
import IUsersRepository from "../contracts/repositories/users";
import ISystemEvents from "../contracts/services/system-events";
import FcmTypes from "../consts/fcm-types";
import IFirestore from "../contracts/services/firestore-service";
import FirestorePaths from "../consts/firestore-paths";

@injectable()
export default class SystemEvents implements ISystemEvents {

    @inject(TYPES.IFcmService) private fcmService: IFcmService;
    @inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository;

    public startOnFirstOpenEventListener(): any{
        return functions.analytics.event('first_open').onLog(async event =>{
            const uid = event.data.user.userId;
            console.log(uid);
        });
    }

    public startOnAppRemoveEventListener() {
        return functions.analytics.event('app_remove').onLog(async event =>{
            const uid = event.data.user.userId;
            const user = await this.usersRepository.getUser(uid);
            const path = `${FirestorePaths.usersLocation}/${user.driverType}_${user.id}`;

            console.log("A removal of: " + path);

            admin.database().ref(path).remove();
        });
    }
}