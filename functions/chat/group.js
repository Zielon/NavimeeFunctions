// Add the default groups to a user during logging or registering 

const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

// Node exports

module.exports.group = functions.firestore
  .document('USERS/{userId}')
  .onCreate(event => {
    var user = event.data.data();
    var id = event.params.userId;

    var ref = db.collection('USERS').doc(id).collection('GROUP');

    var drively = ref.doc().set({roomId: '0'})
    var general = ref.doc().set({roomId: '1'})

    Promise.all([drively, general]).then(values => {
        var groupDrively = db.collection('GROUP').doc('0').collection('MEMBERS').doc(id).set({memberId: id});
        var groupGeneral = db.collection('GROUP').doc('1').collection('MEMBERS').doc(id).set({memberId: id});
    })
});