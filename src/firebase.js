import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyBAM-F2FLHrBzP4N5RhwgXf8qjWBSJfAqM",
    authDomain: "better-uno.firebaseapp.com",
    databaseURL: "https://better-uno-default-rtdb.firebaseio.com",
    projectId: "better-uno",
    storageBucket: "better-uno.appspot.com",
    messagingSenderId: "43019699287",
    appId: "1:43019699287:web:4c346dc70d9202f6ee0f12",
    measurementId: "G-3HCQFZC4H2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;