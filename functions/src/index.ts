'use strict';

import * as functions from 'firebase-functions'

import TYPES from "./types";
import SlackChannel from './models/slack-channel'
import container from "./composition-root";
import IChatNotifier from "./contracts/services/chat-notifier";
import SystemEvents from './services/system-events-impl';
import ISystemEvents from './contracts/services/system-events';
import ISlackService from './contracts/services/slack-service';

const slackChannels = [
    new SlackChannel("Ogólny", "eMdEbXYPDF4PIWZTlcn9Vy96", "OGOLNY", functions.config().slack.url_general),
    new SlackChannel("Drively", "NG6EibtP7jTf327bInzBpuvA", "DRIVELY", functions.config().slack.url_team)
]

// SLACK
const slackService = container.get<ISlackService>(TYPES.ISlackService);

export const onGeneralChatListener = slackService.startOnDocumentListener(slackChannels[0]);
export const onSlackGeneralListener = slackService.startOnRequestListener(slackChannels[0]);

export const onTeamChatListener = slackService.startOnDocumentListener(slackChannels[1]);
export const onSlackTeamListener = slackService.startOnRequestListener(slackChannels[1]);

// CHAT
const chatNotifier = container.get<IChatNotifier>(TYPES.IChatNotifier);

export const onPrivateChatListener = chatNotifier.startOnPrivateChat();
export const onGroupChatListener = chatNotifier.startOnGroupChat();
export const onCreateGroupsListener = chatNotifier.createDefaultGroups();

// SYSTEM EVENTS
const systemEvents = container.get<ISystemEvents>(TYPES.ISystemEvents);

export const onSystemFirstOpenListener = systemEvents.startOnFirstOpenEventListener();