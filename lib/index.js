'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const default_groups_1 = require("./chat/default-groups");
const chat_notifier_1 = require("./chat/chat-notifier");
const channel_1 = require("./chat/channel");
const slackChannels = [
    new channel_1.default("General", "eMdEbXYPDF4PIWZTlcn9Vy96", "1", functions.config().slack.url_general),
    new channel_1.default("Team", "NG6EibtP7jTf327bInzBpuvA", "0", functions.config().slack.url_team)
];
exports.createGroups = new default_groups_1.default().defaultGroup();
exports.startOnDocumentListenerGeneral = new chat_notifier_1.default(slackChannels[0]).startOnDocumentListener();
exports.startOnRequestListenerGeneral = new chat_notifier_1.default(slackChannels[0]).startOnRequestListener();
exports.startOnDocumentListenerTeam = new chat_notifier_1.default(slackChannels[1]).startOnDocumentListener();
exports.startOnRequestListenerTeam = new chat_notifier_1.default(slackChannels[1]).startOnRequestListener();
//# sourceMappingURL=index.js.map