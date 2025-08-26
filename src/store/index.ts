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
import missingNumberRemedySlice from "./slices/missingNumber";
import rajyogSlice from "./slices/rajyogSlice";
import tagSLice from "./slices/tag";
import questionReducer from "./slices/questionSlice";
import zoneReducer from "./slices/Zone";
import housesReducer from "./slices/houses";
import personalYearReducer from "./slices/personalYear";

import newAnalyticsReducer from "./slices/newAnalytics";
import numerologyNumbersReducer from "./slices/numerologyNumbers";
import yogReducer from "./slices/yog";
import entranceReducer from "./slices/entrance"; 
import analysisReducer from "./slices/analysis";
import advanceReducer from "./slices/advance";
import profileReducer from "./slices/Profile";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: user,
    content: content,
    analytics: anayltics,
    analysis: analysisReducer,
    rashi: rashi,
    vastuEntrance: vastuEntranceSlice,
    entranceChoice: entranceChoiceSlice,
    personality: personalitySlice,
    yearPredictions: yearPredictionsSlice,
    planet: planetReducer,
    missingNumber: missingNumberRemedySlice,
    rajyog: rajyogSlice,
    yog: yogReducer,
    tag: tagSLice,
    question: questionReducer,
    zone: zoneReducer,
    house: housesReducer,
    personalYear: personalYearReducer,
    newAnalytics: newAnalyticsReducer,
    numerologyNumbers: numerologyNumbersReducer,
    entrance: entranceReducer,
    advance: advanceReducer,
    profile: profileReducer,
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
