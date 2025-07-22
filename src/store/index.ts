import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authslice";
import anayltics from "./slices/anayltics";
import user from "./slices/user";
import content from "./slices/content";
import rashi from "./slices/rashi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: user,
    content: content,
    analytics: anayltics,
    rashi: rashi,
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
