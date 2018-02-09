"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const rp = require("request-promise");
const inversify_1 = require("inversify");
let SlackSender = class SlackSender {
    constructor(url) {
        this.url = url;
    }
    send(message) {
        return rp({
            method: 'POST',
            uri: this.url,
            body: {
                attachments: [
                    message.serialize()
                ]
            },
            json: true
        });
    }
};
SlackSender = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [String])
], SlackSender);
exports.default = SlackSender;
//# sourceMappingURL=slack-sender.js.map