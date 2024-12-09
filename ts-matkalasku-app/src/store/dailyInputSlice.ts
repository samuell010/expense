import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for the initial state
interface DailyInputState {
  travelByPlaneShip: boolean;
  destination: string;
  startDateTime: string | null; // Store the date as an ISO string
  endDateTime: string | null;
  lessFiveKm: boolean;
  lessFifteenKm: boolean;
  nightTravel: boolean;
  freeMeals: boolean;
  showInput: boolean;
}
// Define the initial state using the type
const initialState: DailyInputState = {
  travelByPlaneShip: false,
  destination: "",
  startDateTime: null, //time and date is stored in ISO and time is UTC zone
  endDateTime: null,
  lessFiveKm: false,
  lessFifteenKm: false,
  nightTravel: false,
  freeMeals: false,
  showInput: false,
};

// Create the slice
const dailyInputSlice = createSlice({
  name: "kilometerAllowance",
  initialState,
  reducers: {
    setTravelByPlaneShip: (state, action: PayloadAction<boolean>) => {
      state.travelByPlaneShip = action.payload;
    },
    setDestination: (state, action: PayloadAction<string>) => {
      state.destination = action.payload;
    },
    setStartDateTimeDaily: (state, action: PayloadAction<string | null>) => {
      // Store the ISO string or null
      state.startDateTime = action.payload;
    },
    setEndDateTimeDaily: (state, action: PayloadAction<string | null>) => {
      // Store the ISO string or null
      state.endDateTime = action.payload;
    },
    setLessFiveKm: (state, action: PayloadAction<boolean>) => {
      state.lessFiveKm = action.payload;
    },
    setLessFifteenKm: (state, action: PayloadAction<boolean>) => {
      state.lessFifteenKm = action.payload;
    },
    setNightTravel: (state, action: PayloadAction<boolean>) => {
      state.nightTravel = action.payload;
    },
    setFreeMeals: (state, action: PayloadAction<boolean>) => {
      state.freeMeals = action.payload;
    },
    setShowInput: (state) => {
      state.showInput = !state.showInput;
    },
    resetDailyInput: () => initialState, // Reset everything
  },
});

// Export the actions
export const {
  setTravelByPlaneShip,
  setDestination,
  setStartDateTimeDaily,
  setEndDateTimeDaily,
  setLessFiveKm,
  setLessFifteenKm,
  setNightTravel,
  setFreeMeals,
  setShowInput,
  resetDailyInput,
} = dailyInputSlice.actions;

// Export the reducer
export default dailyInputSlice.reducer;
