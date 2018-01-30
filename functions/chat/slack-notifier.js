// Listen and response for slack messages

const admin = require('firebase-admin');
const functions = require('firebase-functions');
const moment = require('moment');
const rp = require('request-promise');
const dateFormat = require('dateformat');

const MESSAGES = 'MESSAGES';
const DRIVELY_TEAM = '0'
const ACCOUNT_ID = 'ADMIN_DRIVELY'

if(admin.apps.length == 0)
    admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

module.exports.onRequest = functions.https.onRequest((req, res) => {
  const token = req.body.token;
  if(token !== "NG6EibtP7jTf327bInzBpuvA") return;

  const message = req.body.text;
  const trigger = req.body.trigger_word;

  var ref = db.collection(MESSAGES).doc(DRIVELY_TEAM).collection(MESSAGES).doc().set({
    emailSender: 'kontakt@drively.pl',
    idReceiver: DRIVELY_TEAM,
    idSender: ACCOUNT_ID,
    nameSender: 'Drively',
    text: message.split(trigger)[1].trim(),
    timestamp: moment().valueOf()
  });
  res.sendStatus(200);
});

module.exports.onMessage = functions.firestore
  .document(`${MESSAGES}/${DRIVELY_TEAM}/${MESSAGES}/{messageId}`)
  .onCreate(event => {
    var message = event.data.data();

    if(message.idSender === ACCOUNT_ID) return;

    const date = new Date(message.timestamp);
    notifySlack(message.text, message.nameSender, date).then(() => {
        console.log(`Logged a message from ${message.nameSender}`);
    });
});

const notifySlack = (message, author, date) => {
  return rp({
    method: 'POST',
    uri: functions.config().slack.url,
    body: {
      text: message,
      color: '#D00000',
      fields: [
          {
            title: `Message from [${author}]`,
            value: dateFormat(date, "dddd, mmmm dS, yyyy, h:MM:ss TT"),
            short: false
          }
      ]
    },
    json: true
  });
};