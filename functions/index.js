'use strict';

const chat = require('./chat/group');

// Export to the firebase
exports.createGroups = chat.group;