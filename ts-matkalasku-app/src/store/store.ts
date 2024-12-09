import { configureStore } from "@reduxjs/toolkit";
import kilometerReducer from "./kilometersAllowanceSlice";
import dailyInputReducer from "./dailyInputSlice"; // Import the dailyAllowanceSlice reducer
import dailyAllowanceReducer from "./dailyAllowanceSlice";
import additionalReducer from "./additionalExpenseSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; //Defaults to localStorage for web

//Persisted configuration
const kilometerAllowancePersistConfig = {
  key: "kilometerAllowance",
  storage,
};

// Create a persisted reducer for the kilometerAllowance slice
const persistedKilometerReducer = persistReducer(
  kilometerAllowancePersistConfig,
  kilometerReducer,
);
const store = configureStore({
  reducer: {
    // kilometerAllowance: kilometerReducer, //We have a slice of state (kilometersAllowance) and reducer (kilometerReducer a function or functions ) that defines how the state related to kilometer allowances is updated
    kilometerAllowance: persistedKilometerReducer,
    dailyAllowance: dailyAllowanceReducer,
    dailyInput: dailyInputReducer,
    additionalExpenses: additionalReducer,
  },
  devTools: process.env.NODE_ENV !== "production", // Enable DevTools in development mode
});

export const persistor = persistStore(store);
export default store;

//We are gonna use these types for type useSelector and useDispatch hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
