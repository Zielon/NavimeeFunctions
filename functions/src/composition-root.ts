import { Container } from "inversify";
import TYPES from "./types";

import IFcmService from "./contracts/services/fcm-service";
import IChatNotifier from "./contracts/services/chat-notifier";
import ISlackService from "./contracts/services/slack-service";

import FcmService from './services/fcm-service-impl'
import SlackService from "./services/slack-service-impl";
import ChatNotifier from './services/chat-notifier-impl'
import IUsersRepository from "./contracts/repositories/users";
import UsersRepository from "./repositories/user-repository";
import IFirestore from "./contracts/services/firestore-service";
import FirestoreService from "./services/firestore-impl";
import ChatRepository from "./repositories/chat-repository";
import IChatRepository from "./contracts/repositories/chat";
import SystemEvents from "./services/system-events-impl";
import ISystemEvents from "./contracts/services/system-events";
import IUserAuth from "./contracts/services/user-auth";
import UserAuth from "./services/user-auth-impl";
import IEmailService from "./contracts/services/email-service";
import EmailService from "./services/email-service-impl";
import IStorageRepository from "./contracts/repositories/storage";
import StorageRepository from "./repositories/storage-repository";

const container = new Container();

// SERVICES
container.bind<IFcmService>(TYPES.IFcmService).to(FcmService);
container.bind<IChatNotifier>(TYPES.IChatNotifier).to(ChatNotifier);
container.bind<ISlackService>(TYPES.ISlackService).to(SlackService);
container.bind<IFirestore>(TYPES.IFirestore).to(FirestoreService);
container.bind<ISystemEvents>(TYPES.ISystemEvents).to(SystemEvents);
container.bind<IUserAuth>(TYPES.IUserAuth).to(UserAuth);
container.bind<IEmailService>(TYPES.IEmailService).to(EmailService);

// REPOSITORIES
container.bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository);
container.bind<IChatRepository>(TYPES.IChatRepository).to(ChatRepository);
container.bind<IStorageRepository>(TYPES.IStorageRepository).to(StorageRepository);

export default container;