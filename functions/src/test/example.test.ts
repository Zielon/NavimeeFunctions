import { expect } from 'chai';
import 'mocha';
import * as functions from 'firebase-functions'

import FirestoreBase from './firestore'
import FirestorePaths from '../consts/firestore-paths'
import Chat from '../chat/chat-notifier'
import Channel from '../chat/channel'

describe('Firestore initialization tests', () => {
  before(() => {
    FirestoreBase.initFirestore();
  });

  describe('Get sample data from AvailableCity collection', async () => {
    it('Gdansk exists', async () => {
      let documnet = await FirestoreBase.getFirestore()
        .collection(FirestorePaths.availableCities)
        .doc(FirestorePaths.byCity)
        .collection('GDANSK').doc('2261011').get();

      expect(documnet.exists).to.equal(true);
    });
  });
});