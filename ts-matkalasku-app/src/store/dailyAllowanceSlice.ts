import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interface to represent a single day
interface Day {
  id: number | null;
  travelByPlaneShip: boolean;
  destination: string;
  startDateTime: string | null; // Can be a Date or ISO string
  endDateTime: string | null;
  lessFiveKm: boolean;
  lessFifteenKm: boolean;
  nightTravel: boolean;
  allowance: number;
  freeMeals: boolean;
}

// Interface for the overall state
interface DailyAllowanceState {
  description: string;
  reimbursement: number;
  days: Day[]; // Array of Day objects
}

// Define the initial state using the type
const initialState: DailyAllowanceState = {
  description: "",
  reimbursement: 0,
  days: [],
};

// Create the slice
const dailyAllowanceSlice = createSlice({
  name: "kilometerAllowance",
  initialState,
  reducers: {
    setDescriptionDaily: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setDays: (state, action: PayloadAction<Day[]>) => {
      state.days = action.payload; // Set all the days at once
    },
    deleteDay: (state, action) => {
      const id = action.payload;
      state.days = state.days.filter((day) => day.id !== id); // Remove the day with the matching id
    },
    updateDayInRedux: (state, action) => {
      const updatedDay = action.payload;

      state.days = state.days.map((day) =>
        day.id === updatedDay.id
          ? { ...day, ...updatedDay } // Merge updated fields into existing day object
          : day,
      );
    },
  },
});

// Export the actions
export const { setDescriptionDaily, setDays, deleteDay, updateDayInRedux } =
  dailyAllowanceSlice.actions;

// Export the reducer
export default dailyAllowanceSlice.reducer;
