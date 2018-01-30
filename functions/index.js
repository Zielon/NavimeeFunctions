'use strict';

const chat = require('./chat/default-groups');
const slack = require('./chat/slack-notifier');

// Export to the firebase
exports.createGroups = chat.group;
exports.slackOnRequest = slack.onRequest;
exports.slackOnMessage = slack.onMessage;