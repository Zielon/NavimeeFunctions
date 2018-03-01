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

@injectable()
export default class SystemEvents implements ISystemEvents {

    @inject(TYPES.IFcmService) private fcmService: IFcmService;
    @inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository;

    public startOnFirstOpenEventListener(): any{
        return functions.analytics.event('first_open').onLog(async event =>{
            const uid = event.data.user.userId;
            const appVerion = event.data.user.appInfo.appVersion;
            
            const receiver = await this.usersRepository.getUser(uid);

            const payload = new FcmPayload({ appInfo: appVerion, user: receiver, type: FcmTypes.APP_FIRST_OPEN_TYPE });
            this.fcmService.sendToSingle(payload, receiver.token);
        });
    }
}