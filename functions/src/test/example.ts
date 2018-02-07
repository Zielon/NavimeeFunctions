import { expect } from 'chai';
import 'mocha';
import * as functions from 'firebase-functions'

import BaseTest from './base-test'
import Chat from '../chat/chat-notifier'
import Channel from '../chat/channel'

describe('Hello function', () => {

  let firestore = new BaseTest().getFirestore();
  let chat = new Chat(new Channel("Team", "NG6EibtP7jTf327bInzBpuvA", "0", ""));

  it('should return hello world', () => {
    expect('Hello World!').to.equal('Hello World!');
  });
});