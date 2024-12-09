import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import kilometerReducer from "./kilometersAllowanceSlice";
import { createTransform } from "redux-persist";
import { setStartDate } from "./dailyAllowanceSlice";

interface AppState {
  startDate: Date | null;
  endDate: Date | null;
}
//Create a custom transform for serializing and deserializing Date objects

const dateTransform = createTransform(
  // Serialization (called when persisting the state)
  (inboundState: any) => {
    if (inboundState.startDate) {
      return {
        ...inboundState,
        startDate:
          inboundState.startDate instanceof Date
            ? inboundState.startDate.toISOString()
            : inboundState.startDate,
      };
    }
    return inboundState;
  },
  // Deserialaization (called when rehydrating the state)
  (outboundState: any) => {
    if (outboundState.startDate) {
      return {
        ...outboundState,
        startDate: new Date(outboundState.startDate),
      };
    }
    return outboundState;
  },
  // Specify the slice of the state to which this applies
  { whitelist: ["kilometerAllowance"] },
);

//Redux Persist Configuration
const persistConfig = {
  key: "root",
  storage,
  // Optionally, you can add transforms to handle serialization issues here
  transforms: [
    // {
    //   in: (state: AppState) => ({
    //     ...state,
    //     startDate: state.startDate ? state.startDate.toISOString() : null,
    //     endDate: state.endDate ? state.endDate.toISOString() : null,
    //   }),
    //   out: (state: AppState) => ({
    //     ...state,
    //     startDate: state.startDate ? new Date(state.startDate) : null,
    //     endDate: state.endDate ? new Date(state.endDate) : null,
    //   }),
    // },
    dateTransform,
  ],
};

const rootReducer = combineReducers({
  kilometerAllowance: kilometerReducer,
});

// Apply the persistence to the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Setup Redux store with the persisted reducer
// Use serializableCheck middleware option to avoid warnings for specific use cases
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific actions or paths if needed
        ignoredActions: ["persist/PERSIST"],
        ignoredPaths: ["persist"],
      },
    }),
});

const persistor = persistStore(store);

export default store;
export { persistor };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//Without middleware
// import { configureStore } from "@reduxjs/toolkit";
// import storage from 'redux-persist/lib/storage'; // default: localStorage for web
// import { persistReducer, persistStore } from 'redux-persist';
// import { combineReducers } from 'redux'; // if using multiple reducers
// import kilometerReducer from "./kilometersAllowanceSlice";
// //import dailyReducer from "./dailyAllowanceSlice"; // Import the dailyAllowanceSlice reducer

// const persistConfig = {
//     key: 'root', // the key in localStorage
//     storage, // the type of storage (default is localStorage)

//   };

// const rootReducer = combineReducers({
//   kilometerAllowance: kilometerReducer, //We have a slice of state (kilometersAllowance) and reducer (kilometerReducer a function or functions ) that defines how the state related to kilometer allowances is updated
//          //dailyAllowance: dailyReducer,
//       // otherExpanses: expensesReducer

// });

// Apply persistReducer to root reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer)

// const store = configureStore({
//     reducer: persistedReducer,
// });

// const persistor = persistStore(store); // to enable persistence

// without persist
// const store = configureStore({
//   reducer: {
//       kilometerAllowance: kilometerReducer, //We have a slice of state (kilometersAllowance) and reducer (kilometerReducer a function or functions ) that defines how the state related to kilometer allowances is updated
//       //dailyAllowance: dailyReducer,
//     }});

// export default store;
// // export { persistor };

// //We are gonna use these types for type useSelector and useDispatch hooks
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
