'use client';

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// import { getAnalytics } from 'firebase/analytics';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC110_DqL1Vy5I0Rv2D8jW2OQWCCCdYtKw',
  authDomain: 'mediaresolver.firebaseapp.com',
  databaseURL: 'https://mediaresolver-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'mediaresolver',
  storageBucket: 'mediaresolver.firebasestorage.app',
  messagingSenderId: '244503852955',
  appId: '1:244503852955:web:2bc4fb699db16d8de0d33e',
  measurementId: 'G-7C82MQG0P7',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let messaging;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error('Error initializing Firebase messaging:', error);
  }
}

export { app, messaging, getToken, onMessage };
