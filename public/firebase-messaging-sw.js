importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyC110_DqL1Vy5I0Rv2D8jW2OQWCCCdYtKw',
  authDomain: 'mediaresolver.firebaseapp.com',
  projectId: 'mediaresolver',
  messagingSenderId: '244503852955',
  appId: '1:244503852955:web:2bc4fb699db16d8de0d33e',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    data: {
      click_action: payload.data?.click_action || 'https://sundesign.io/',
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
self.addEventListener('notificationclick', function (event) {
  const clickAction = event.notification.data?.click_action || 'https://sundesign.io/';
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === clickAction && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(clickAction);
      }
    }),
  );
});
