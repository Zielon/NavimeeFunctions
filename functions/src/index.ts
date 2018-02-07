'use strict';

import * as functions from 'firebase-functions'

import CreateDefaultGroups from './chat/default-groups'
import Chat from './chat/chat-notifier'
import Channel from './chat/channel'

const slackChannels = [
        new Channel("General", "eMdEbXYPDF4PIWZTlcn9Vy96", "1", functions.config().slack.url_general),
        new Channel("Team", "NG6EibtP7jTf327bInzBpuvA", "0", functions.config().slack.url)
    ]

const group = new CreateDefaultGroups();
export const createGroups = group.defaultGroup;

const chatGeneral = new Chat(slackChannels[0]);
export const startOnDocumentListenerGeneral = chatGeneral.startOnDocumentListener;
export const startOnRequestListenerGeneral = chatGeneral.startOnRequestListener;

const chatTeam = new Chat(slackChannels[1]);
export const startOnDocumentListenerTeam = chatTeam.startOnDocumentListener;
export const startOnRequestListenerTeam = chatTeam.startOnRequestListener;