import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authslice";
import anayltics from "./slices/anayltics";
import user from "./slices/user";
import content from "./slices/content";
import rashi from "./slices/rashi";
import vastuEntranceSlice from "./slices/vastuEntranceAnalysisSlice";
import entranceChoiceSlice from "./slices/entranceChoiceSlice";
import personalitySlice from "./slices/personality";
import yearPredictionsSlice from "./slices/yearPredictions";
import planetReducer from "./slices/planet";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: user,
    content: content,
    analytics: anayltics,
    rashi: rashi,
    vastuEntrance: vastuEntranceSlice,
    entranceChoice: entranceChoiceSlice,
    personality: personalitySlice,
    yearPredictions: yearPredictionsSlice,
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
