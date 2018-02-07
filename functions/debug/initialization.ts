import * as admin from 'firebase-admin'
var google = require('./config.json');

export default class Initialize{
    public init(){
        if (admin.apps.length === 0)
            admin.initializeApp({
                credential: admin.credential.cert(google),
                databaseURL: (<any>google).project_info.firebase_url
            });
    }
}