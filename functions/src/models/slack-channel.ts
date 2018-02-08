export default class SlackChannel {
    token: string;
    channelId: string;
    url: string;
    name: string;

    constructor(name: string, token: string, channel: string, url: string) {
        this.channelId = channel;
        this.token = token;
        this.url = url;
        this.name = name;
    }
}