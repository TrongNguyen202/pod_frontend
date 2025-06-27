import { combineReducers } from '@reduxjs/toolkit';
import auth from './auth';
import main from './main';
import userAdmin from './user-admin';
import shops from './shops';
import users from './user';
import products from './products';
import orders from './orders';
import boards from './boards';
import productTypes from './product-types';
import templates from './templates';
import images from './images';
import comments from './comments';
import fcmtoken from './fcmtoken';
import qrtransaction from './qrtransaction';
import userwallets from './userwallets';
import notifications from './notifications';
import warehouses from './warehouse';
import statistics from './statistics';
import google from './google';
import flashShip from './flash-ship';
import categories from './categories';
import shopsBrand from './shops-brand';
import ckf from './ckf-variant';
const rootReducer = combineReducers({
  auth,
  main,
  boards,
  productTypes,
  templates,
  orders,
  images,
  comments,
  fcmtoken,
  qrtransaction,
  userwallets,
  notifications,
  userAdmin,
  shops,
  users,
  products,
  warehouses,
  statistics,
  google,
  flashShip,
  categories,
  shopsBrand,
  ckf,
});

export default rootReducer;
