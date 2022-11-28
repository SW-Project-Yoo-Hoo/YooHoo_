import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";

import { shopItemSlice } from "./modules/shopItem";
import { shopListSlice } from "./modules/shopList";

const rootReducer = combineReducers({
  shopListSlice: shopListSlice.reducer,
  shopItemSlice: shopItemSlice.reducer,
});

export default configureStore({
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
