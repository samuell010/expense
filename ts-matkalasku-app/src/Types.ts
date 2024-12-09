export interface KilometerAllowanceEntry {
  reportId: number | null;
  distance: number;
  passengers: number;
  passengerNames: string[];
  startPoint: string | null;
  endPoint: string | null;
  startLat: number | null;
  startLng: number | null;
  endLat: number | null;
  endLng: number | null;
  // showMap: { show: boolean; type: string | null };
  startDate: string | null; // Store the date as an ISO string
  endDate: string | null;
  // startTimeKm: string | null;
  // endTimeKm: string | null;
  description: string;
  totalCost: number;
  vehicleInfo: string;
}

export interface AdditionalExpensesEntry {
  reportId: number | null;
  // id: number;
  type: string;
  description: string;
  date: string;
  amount: number;
  country: string;
  sum: number;
  vat: number;
  comment: string;
  attachments: string[];
}
