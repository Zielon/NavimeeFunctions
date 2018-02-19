import { Container } from "inversify";
import TYPES from "./types";

import { IFcmService } from "./contracts/services/fcm-sender";
import { IChatNotifier } from "./contracts/services/chat-notifier";
import { ISlackService } from "./contracts/services/slack-sender";

import FcmService from './services/fcm-sender'
import SlackService from "./services/slack-sender";
import ChatNotifier from './chat/chat-notifier'
import IUsersRepository from "./contracts/repositories/users";
import UsersRepository from "./repositories/user-repository";
import IFirestore from "./contracts/services/firestore-service";
import FirestoreService from "./services/firestore";
import ChatRepository from "./repositories/chat-repository";
import IChatRepository from "./contracts/repositories/chat";

const container = new Container();

container.bind<IFcmService>(TYPES.IFcmService).to(FcmService);
container.bind<IChatNotifier>(TYPES.IChatNotifier).to(ChatNotifier);
container.bind<ISlackService>(TYPES.ISlackService).to(SlackService);
container.bind<IFirestore>(TYPES.IFirestore).to(FirestoreService);

container.bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository);
container.bind<IChatRepository>(TYPES.IChatRepository).to(ChatRepository);

export default container;