"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
class FirestoreMessage {
    constructor(channel, text) {
        this.emailSender = "kontakt@drively.pl";
        this.nameSender = "Drively";
        this.timestamp = moment().valueOf();
        this.idSender = "ADMIN_DRIVELY";
        this.idReceiver = channel;
        this.text = text;
    }
}
exports.FirestoreMessage = FirestoreMessage;
class SlackFields {
    constructor(author, date) {
        this.short = false;
        this.value = date.toLocaleString();
        this.title = `Message from ${author}`;
    }
}
class SlackMessage {
    constructor(text, author, date) {
        this.color = "#D00000";
        this.text = text;
        this.fields = [new SlackFields(author, date)];
    }
}
exports.SlackMessage = SlackMessage;
//# sourceMappingURL=messages.js.map