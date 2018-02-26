'use strict';

import * as functions from 'firebase-functions'

import TYPES from "./types";
import CreateDefaultGroups from './chat/default-groups'
import ChatSlack from './chat/chat-slack'
import SlackChannel from './models/slack-channel'
import ChatNotifier from "./chat/chat-notifier";
import container from "./composition-root";
import { IChatNotifier } from "./contracts/services/chat-notifier";
import SystemEvents from './services/system-events-impl';
import ISystemEvents from './contracts/services/system-events';

const slackChannels = [
    new SlackChannel("General", "eMdEbXYPDF4PIWZTlcn9Vy96", "1", functions.config().slack.url_general),
    new SlackChannel("Team", "NG6EibtP7jTf327bInzBpuvA", "0", functions.config().slack.url_team)
]

// DEFAULT
export const onCreateGroupsListener = new CreateDefaultGroups().defaultGroup();

// SLACK
export const onGeneralChatListener = new ChatSlack(slackChannels[0]).startOnDocumentListener();
export const onSlackGeneralListener = new ChatSlack(slackChannels[0]).startOnRequestListener();
export const onTeamChatListener = new ChatSlack(slackChannels[1]).startOnDocumentListener();
export const onSlackTeamListener = new ChatSlack(slackChannels[1]).startOnRequestListener();

// FCM
const chatNotifier = container.get<IChatNotifier>(TYPES.IChatNotifier);

export const onPrivateChatListener = chatNotifier.startOnPrivateChat();
export const onGroupChatListener = chatNotifier.startOnGroupChat();

// SYSTEM EVENTS
const systemEvents = container.get<ISystemEvents>(TYPES.ISystemEvents);

export const onSystemFirstOpenListener = systemEvents.startOnFirstOpenEventListener();