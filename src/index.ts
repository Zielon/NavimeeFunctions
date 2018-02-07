'use strict';

import * as functions from 'firebase-functions'

import CreateDefaultGroups from './chat/default-groups'
import Chat from './chat/chat-notifier'
import Channel from './chat/channel'

const slackChannels = [
        new Channel("General", "eMdEbXYPDF4PIWZTlcn9Vy96", "1", functions.config().slack.url_general),
        new Channel("Team", "NG6EibtP7jTf327bInzBpuvA", "0", functions.config().slack.url_team)
    ]

export const createGroups = new CreateDefaultGroups().defaultGroup();
export const startOnDocumentListenerGeneral = new Chat(slackChannels[0]).startOnDocumentListener();
export const startOnRequestListenerGeneral = new Chat(slackChannels[0]).startOnRequestListener();
export const startOnDocumentListenerTeam = new Chat(slackChannels[1]).startOnDocumentListener();
export const startOnRequestListenerTeam = new Chat(slackChannels[1]).startOnRequestListener();