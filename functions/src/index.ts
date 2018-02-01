'use strict';

import * as functions from 'firebase-functions'

import CreateDefaultGroups from './chat/default-groups'
import Chat from './chat/chat-notifier'
import Channel from './chat/channel'

// Export to the firebase
const group = new CreateDefaultGroups();

exports.createGroups = group.defaultGroup;

class Export{
    export(channels: Array<Channel>){
        channels.forEach(c =>{
            const chat = new Chat(c.channelId, c.url, c.token)
            Object.defineProperty(exports, "startOnDocumentListener" + c.name, chat.startOnDocumentListener);
            Object.defineProperty(exports, "startOnRequestListener" + c.name, chat.startOnRequestListener);
        })
    }
}

const slackChannels = [
        new Channel("General", "eMdEbXYPDF4PIWZTlcn9Vy96", "1", functions.config().slack.url_general),
        new Channel("Team", "NG6EibtP7jTf327bInzBpuvA", "0", functions.config().slack.url)
    ]

new Export().export(slackChannels)