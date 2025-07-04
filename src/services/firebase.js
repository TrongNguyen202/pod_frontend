'use client';

import { app, messaging } from 'src/utils/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { getDatabase, ref, onChildAdded, off } from 'firebase/database';
import { fetchPostFcmToken } from 'src/redux/reducers/fcmtoken';
import { toast } from 'react-toastify';

const db = getDatabase(app);

export const listenToOrderComments = (orderId, onNewComment) => {
  const commentsRef = ref(db, `comments/${orderId}`);
  const listener = onChildAdded(commentsRef, (snapshot) => {
    const comment = snapshot.val();
    const id = snapshot.key;
    onNewComment({ ...comment, commentId: id });
  });

  return () => off(commentsRef, 'child_added', listener);
};

export const requestPermissionAndListen = async (userId, dispatch) => {
  try {
    // Check if running in browser
    if (typeof window === 'undefined') {
      console.warn('Not running in browser environment');
      return;
    }

    // Check if messaging is available
    if (!messaging) {
      console.warn('Firebase messaging not initialized');
      return;
    }

    // Check if already registered
    if (sessionStorage.getItem('fcmTokenRegistered') === 'true') {
      return;
    }

    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return;
    }
    
    const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const fcmToken = await getToken(messaging, {
      vapidKey: 'BP3Ie7-PY4bZp2q95_lkSqmvdFygr4zoY7Y_F17fmCKCy7hJL_NmFPR06cI7r_snmGRQlA9qwTmPz07L4AVGS_A',
      serviceWorkerRegistration: swRegistration,
    });

    if (!fcmToken) {
      console.warn('FCM Token không được cấp phép (có thể user từ chối).');
      return;
    }

    const data = { userId, fcmToken };
    await dispatch(fetchPostFcmToken({ data }));

    sessionStorage.setItem('fcmTokenRegistered', 'true');
  } catch (err) {
    console.error('Không lấy được token FCM:', err);
  }
  onMessage(messaging, (payload) => {
    const { title, body } = payload.notification || {};
    const { click_action } = payload.data || {};

    if (title || body) {
      toast(
        (t) => (
          <div
            onClick={() => {
              toast.dismiss(t.id);
              if (click_action) {
                window.location.href = click_action;
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <strong>{title}</strong>
            <br />
            {body}
          </div>
        ),
        { duration: 5000 },
      );
    }
  });
};
