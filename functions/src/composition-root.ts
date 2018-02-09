import { Container } from "inversify";
import TYPES from "./types";

import { IFcmSender } from "./contracts/fcm-sender";
import { IChatNotifier } from "./contracts/chat-notifier";
import { ISlackSender } from "./contracts/slack-sender";

import FcmSender from './services/fcm-sender'
import ChatNotifier from './chat/chat-notifier'
import SlackSender from "./chat/slack-sender";

let container = new Container();

container.bind<IFcmSender>(TYPES.IFcmSender).to(FcmSender);
container.bind<IChatNotifier>(TYPES.IChatNotifier).to(ChatNotifier);
container.bind<ISlackSender>(TYPES.ISlackSender).to(SlackSender);

export default container;