// [START initialize_firebase_in_sw]
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/3.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.6.2/firebase-messaging.js');

var config = {
    apiKey: "AIzaSyBI2x7RS-Q8TVrzErDACmnlltELaZL5ve8",
    authDomain: "dealsencash-ec7ee.firebaseapp.com",
    databaseURL: "https://dealsencash-ec7ee.firebaseio.com",
    storageBucket: "dealsencash-ec7ee.appspot.com",
    messagingSenderId: "77951830798"
};

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp(config);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
// [END initialize_firebase_in_sw]

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: 'https://affiliate.dealsencash.com/assets/icon/notification-icon-50x50.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});
// [END background_handler]
