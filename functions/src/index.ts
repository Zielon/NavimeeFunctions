'use strict';

import * as functions from 'firebase-functions'

import TYPES from "./types";
import ChatSlack from './chat/chat-slack'
import SlackChannel from './models/slack-channel'
import ChatNotifier from "./chat/chat-notifier";
import container from "./composition-root";
import { IChatNotifier } from "./contracts/services/chat-notifier";
import SystemEvents from './services/system-events-impl';
import ISystemEvents from './contracts/services/system-events';

const slackChannels = [
    new SlackChannel("Ogólny", "eMdEbXYPDF4PIWZTlcn9Vy96", "OGOLNY", functions.config().slack.url_general),
    new SlackChannel("Drively", "NG6EibtP7jTf327bInzBpuvA", "DRIVELY", functions.config().slack.url_team)
]

// SLACK
export const onGeneralChatListener = new ChatSlack(slackChannels[0]).startOnDocumentListener();
export const onSlackGeneralListener = new ChatSlack(slackChannels[0]).startOnRequestListener();

export const onTeamChatListener = new ChatSlack(slackChannels[1]).startOnDocumentListener();
export const onSlackTeamListener = new ChatSlack(slackChannels[1]).startOnRequestListener();

// CHAT
const chatNotifier = container.get<IChatNotifier>(TYPES.IChatNotifier);

export const onPrivateChatListener = chatNotifier.startOnPrivateChat();
export const onGroupChatListener = chatNotifier.startOnGroupChat();
export const onCreateGroupsListener = chatNotifier.createDefaultGroups();

// SYSTEM EVENTS
const systemEvents = container.get<ISystemEvents>(TYPES.ISystemEvents);

export const onSystemFirstOpenListener = systemEvents.startOnFirstOpenEventListener();