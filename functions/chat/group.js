// Add the default groups to a user during logging or registering 

const functions = require('firebase-functions');
const moment = require('moment');
const cors = require('cors')({ origin: true });

module.exports = functions.https.onRequest((req, res) => {
  if (req.method === 'PUT') {
    res.status(403).send('Forbidden!');
  }

  cors(req, res, () => {
    let format = req.query.format;
    if (!format) {
      format = req.body.format;
    }
    const formattedDate = "New -> " + moment().format(format);
    console.log('Sending Formatted date:', formattedDate);
    res.status(200).send(formattedDate);
  });
})