import { combineReducers } from '@reduxjs/toolkit';
import auth from './auth';
import boards from './boards';
import comments from './comments';
import fcmToken from './fcmtoken';
import images from './images';
import main from './main';
import notifications from './notifications';
import orders from './orders';
import productTypes from './product-types';
import qrtransaction from './qrtransaction';
import statistics from './statistics';
import templates from './templates';
import users from './user';
import usertopups from './usertopups';
import userwallets from './userwallets';
const rootReducer = combineReducers({
  auth,
  main,
  boards,
  productTypes,
  templates,
  orders,
  images,
  comments,
  fcmToken,
  qrtransaction,
  userwallets,
  notifications,
  usertopups,
  users,
  statistics,
});

export default rootReducer;
