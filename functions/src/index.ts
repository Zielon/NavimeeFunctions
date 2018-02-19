'use strict';

import * as functions from 'firebase-functions'

import TYPES from "./types";
import CreateDefaultGroups from './chat/default-groups'
import ChatSlack from './chat/chat-slack'
import SlackChannel from './models/slack-channel'
import ChatNotifier from "./chat/chat-notifier";
import container from "./composition-root";
import { IChatNotifier } from "./contracts/services/chat-notifier";

const slackChannels = [
    new SlackChannel("General", "eMdEbXYPDF4PIWZTlcn9Vy96", "1", functions.config().slack.url_general),
    new SlackChannel("Team", "NG6EibtP7jTf327bInzBpuvA", "0", functions.config().slack.url_team)
]

// DEFAULT
export const createGroups = new CreateDefaultGroups().defaultGroup();

// SLACK
export const startOnDocumentListenerGeneral = new ChatSlack(slackChannels[0]).startOnDocumentListener();
export const startOnRequestListenerGeneral = new ChatSlack(slackChannels[0]).startOnRequestListener();
export const startOnDocumentListenerTeam = new ChatSlack(slackChannels[1]).startOnDocumentListener();
export const startOnRequestListenerTeam = new ChatSlack(slackChannels[1]).startOnRequestListener();

// FCM
const chatNotifier = container.get<IChatNotifier>(TYPES.IChatNotifier);

export const startOnPrivateChat = chatNotifier.startOnPrivateChat();
export const startOnGroupChat = chatNotifier.startOnGroupChat();