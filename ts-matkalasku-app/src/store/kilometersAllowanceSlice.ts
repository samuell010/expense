import { KilometerAllowanceEntry } from "@/Types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for the initial state
interface KilometerAllowanceState {
  entries:  KilometerAllowanceEntry[]; // Array of entries
  reportId: number | null;
  distance: number;
  passengers: number;
  passengerNames: string[];
  manualInput: boolean;
  startPoint: string | null;
  endPoint: string | null;
  // startCoordinates: { lat: number; lng: number } | null;
  // endCoordinates: { lat: number; lng: number } | null;
  startLat: number | null; // Separate latitude for start point
  startLng: number | null; // Separate longitude for start point
  endLat: number | null; // Separate latitude for end point
  endLng: number | null; // Separate longitude for end point
  showMap: { show: boolean; type: string | null };
  startDate: string | null; // Store the date as an ISO string
  endDate: string | null;
  startTimeKm: string | null;
  endTimeKm: string | null;
  description: string;
  totalCost: number;
  vehicleInfo: string;
}

// Define the initial state using the type
const initialState: KilometerAllowanceState = {
  entries: [],
  reportId: null,
  distance: 0,
  passengers: 0,
  passengerNames: [],
  manualInput: false,
  startPoint: null,
  endPoint: null,
  startLat: null,
  startLng: null,
  endLat: null,
  endLng: null,
  showMap: { show: false, type: null },
  startDate: null,
  endDate: null,
  startTimeKm: null,
  endTimeKm: null,
  description: "",
  totalCost: 0,
  vehicleInfo: "",
};

// Create the slice
const kilometerAllowanceSlice = createSlice({
  name: "kilometerAllowance",
  initialState,
  reducers: {
    setReportId: (state, action: PayloadAction<number>) => {
      state.reportId = action.payload;
    },
    setDistance: (state, action: PayloadAction<number>) => {
      state.distance = action.payload;
    },
    setManualInput: (state, action: PayloadAction<boolean>) => {
      state.manualInput = action.payload;
    },

    incrementPassengers: (state) => {
      if (state.passengers < 5) {
        state.passengers += 1;
        state.passengerNames.push(""); // a string for the new passenger
      }
    },
    decrementPassengers: (state) => {
      if (state.passengers > 0) {
        state.passengers -= 1;
        state.passengerNames.pop(); // Remove the last passenger's name
      }
    },

    updatePassengerName: (
      state,
      action: PayloadAction<{ index: number; name: string }>,
    ) => {
      state.passengerNames[action.payload.index] = action.payload.name;
    },

    setStartPoint: (state, action: PayloadAction<string | null>) => {
      state.startPoint = action.payload;
    },
    setEndPoint: (state, action: PayloadAction<string | null>) => {
      state.endPoint = action.payload;
    },
    setStartLat: (state, action: PayloadAction<number | null>) => {
      state.startLat = action.payload;
    },
    setStartLng: (state, action: PayloadAction<number | null>) => {
      state.startLng = action.payload;
    },
    setEndLat: (state, action: PayloadAction<number | null>) => {
      state.endLat = action.payload;
    },
    setEndLng: (state, action: PayloadAction<number | null>) => {
      state.endLng = action.payload;
    },
    setMap: (
      state,
      action: PayloadAction<{ show: boolean; type: string | null }>,
    ) => {
      state.showMap = action.payload;
    },
    setStartDateKm: (state, action: PayloadAction<string | null>) => {
      // Store the ISO string or null
      state.startDate = action.payload;
    },
    setEndDateKm: (state, action: PayloadAction<string | null>) => {
      // Store the ISO string or null
      state.endDate = action.payload;
    },
    setStartTimeKm: (state, action: PayloadAction<string | null>) => {
      state.startTimeKm = action.payload;
    },
    setEndTimeKm: (state, action: PayloadAction<string | null>) => {
      state.endTimeKm = action.payload;
    },
    setDescriptionKm: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setTotalCostKm: (state, action: PayloadAction<number>) => {
      state.totalCost = action.payload;
    },
    setVehicleInfo: (state, action: PayloadAction<string>) => {
      state.vehicleInfo = action.payload;
    },
    // updateSavedData: (state, action: PayloadAction<KilometerAllowanceState>) => {
    //   return { ...state, ...action.payload };
    // },
    addKmAllowance: (state, action: PayloadAction<KilometerAllowanceEntry>) => {
      state.entries.push(action.payload); //Add new entry to the array
    },
    resetKilometerAllowance: (state) => {
      return initialState;
    },
    clearKmForm: (state) => {
state.distance = 0;
state.passengers = 0;
  state.passengerNames = [];
  state.manualInput = false;
  state.startPoint = null;
  state.endPoint = null;
  state.startLat = null;
  state.startLng = null;
  state.endLat = null;
  state.endLng = null;
  state.showMap = { show: false, type: null };
  state.startDate = null;
  state.endDate = null;
  state.startTimeKm = null;
  state.endTimeKm = null;
  state.description = "";
  state.totalCost = 0;
  state.vehicleInfo = "";

    }
  },
});

// Export the actions
export const {
  setDistance,
  setManualInput,
  incrementPassengers,
  decrementPassengers,
  updatePassengerName,
  setStartPoint,
  setEndPoint,
  setStartLat,
  setStartLng,
  setEndLat,
  setEndLng,
  setMap,
  setStartDateKm,
  setEndDateKm,
  setStartTimeKm,
  setEndTimeKm,
  setDescriptionKm,
  setTotalCostKm,
  setVehicleInfo,
  setReportId,
  // updateSavedData,
  addKmAllowance,
  resetKilometerAllowance,
  clearKmForm,
} = kilometerAllowanceSlice.actions;

// Export the reducer
export default kilometerAllowanceSlice.reducer;
