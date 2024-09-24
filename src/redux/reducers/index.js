import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth";
import main from "./main";
import userAdmin from "./user-admin";
import shops from "./shops";
import users from "./user";
import products from "./products";
import orders from "./orders";
import warehouses from "./warehouse";
import statistics from "./statistics";
import google from "./google";
import flashShip from "./flash-ship";
import categories from "./categories";
import shopsBrand from "./shops-brand";
import ckf from  "./ckf-variant";
const rootReducer = combineReducers({
  auth,
  main,
  userAdmin,
  shops,
  users,
  products,
  orders,
  warehouses,
  statistics,
  google,
  flashShip,
  categories,
  shopsBrand,
  ckf,
});

export default rootReducer;
