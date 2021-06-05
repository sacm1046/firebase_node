const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/storage');
const config = require('../config');

const db = firebase.initializeApp(config.firebaseConfig);
const storage = firebase.storage();
module.exports = {
  db,
  storage,
};
