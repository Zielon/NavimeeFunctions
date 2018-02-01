'use strict';

const chat = require('./chat/default-groups');
const slack = require('./chat/slack-notifier');

// Export to the firebase
exports.createGroups = chat.group;
exports.slackOnRequestTeam = slack.onRequestTeam;
exports.slackOnRequestGeneral = slack.onRequestGeneral;
exports.slackOnMessageTeam = slack.onMessageTeam;
exports.slackOnMessageGeneral = slack.onMessageGeneral;