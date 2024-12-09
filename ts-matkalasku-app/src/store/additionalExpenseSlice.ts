import { AdditionalExpensesEntry } from "@/Types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface Attachment {
  fileName: string;
  url: string;
}


// Define the type for the initial state
interface AdditionalExpenseState {
  entries: AdditionalExpensesEntry[]; // Array of entries
  reportId: number | null;
  // id: number;
  typeCost: string;
  descriptionCost: string;
  dateCost: string;
  amount: number;
  country: string;
  sumCost: number;
  vatPercent: number;
  commentCost: string;
  attachments: Attachment[];
}

// Define the initial state using the type
const initialState: AdditionalExpenseState = {
  entries: [],
  reportId: null,
  // id: 1,
  typeCost: "taxi",
  descriptionCost: "",
  dateCost: "",
  amount: 0,
  country: "Finland",
  sumCost: 0,
  vatPercent: 25.5,
  commentCost: "",
  attachments: [],
};

// Create the slice
const additionalExpensesSlice = createSlice({
  name: "additionalExpenses",
  initialState,
  reducers: {
    setReportId: (state, action: PayloadAction<number>) => {
      state.reportId = action.payload;
    },
    // setid: (state, action: PayloadAction<number>) => {
    //   state.id = action.payload;
    // },
    setTypeCost: (state, action: PayloadAction<string>) => {
      state.typeCost = action.payload;
    },
    setDescriptionCost: (state, action: PayloadAction<string>) => {
      state.descriptionCost = action.payload;
    },
    setDateCost: (state, action: PayloadAction<string>) => {
      state.dateCost = action.payload;
    },
    setAmount: (state, action: PayloadAction<number>) => {
      state.amount = action.payload;
    },
    setCountry: (state, action: PayloadAction<string>) => {
      state.country = action.payload;
    },
    setSumCost: (state, action: PayloadAction<number>) => {
      state.sumCost = action.payload;
    },
    setVatPercent: (state, action: PayloadAction<number>) => {
      state.vatPercent = action.payload;
    },
    setCommentCost: (state, action: PayloadAction<string>) => {
      state.commentCost = action.payload;
    },
    setAttachment: (state, action: PayloadAction<Attachment[]>) => {
      state.attachments = action.payload;
    },
    addAttachment: (state, action: PayloadAction<Attachment>) => {
      state.attachments.push(action.payload); // Add a new attachment
    },
    addAdditionalExpenses: (
      state,
      action: PayloadAction<AdditionalExpensesEntry>,
    ) => {
      state.entries.push(action.payload); //Add new entry to the array
    },
  },
});

// Export the actions
export const {
  // setid,
  setTypeCost,
  setDescriptionCost,
  setDateCost,
  setAmount,
  setCountry,
  setSumCost,
  setVatPercent,
  setCommentCost,
  setAttachment,
  setReportId,
  addAdditionalExpenses,
  addAttachment
} = additionalExpensesSlice.actions;

// Export the reducer
export default additionalExpensesSlice.reducer;
