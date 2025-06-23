import { app, messaging, getToken, onMessage } from 'src/utils/firebase';
import { getDatabase, ref, onChildAdded, off } from 'firebase/database';
import { fetchPostFcmToken } from 'src/redux/reducers/fcmtoken';
import toast from 'react-hot-toast';

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
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('User từ chối cấp quyền thông báo.');
      return;
    }
    // await deleteToken(messaging);
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
