'use strict';

import * as functions from 'firebase-functions'

import CreateDefaultGroups from './chat/default-groups'
import ChatSlack from './chat/chat-slack'
import SlackChannel from './models/slack-channel'
import ChatFcm from "./chat/chat-fcm";

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
export const startOnPrivateChat = new ChatFcm().startOnPrivateChat();
export const startOnGroupChat = new ChatFcm().startOnGroupChat();