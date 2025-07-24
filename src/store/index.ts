import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authslice";
import anayltics from "./slices/anayltics";
import user from "./slices/user";
import content from "./slices/content";
import rashi from "./slices/rashi";
import planetReducer from './slices/planet';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: user,
    content: content,
    analytics: anayltics,
    rashi: rashi,
    planet: planetReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
