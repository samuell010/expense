import NewDestination from "./NewDestination";
import { setDescriptionDaily, setDays } from "../store/dailyAllowanceSlice";
import { resetDailyInput, setShowInput } from "../store/dailyInputSlice";
import { useAppDispatch, useAppSelector } from "@/Hooks";

const DailyAllowance: React.FC = () => {
  const dispatch = useAppDispatch(); //typed
  //Access the Redux state
  const { description, days, reimbursement } = useAppSelector(
    (state) => state.dailyAllowance,
  );
  const showInput = useAppSelector((state) => state.dailyInput.showInput);
  console.log("show input", showInput);
  console.log("days", days);

  const {
    startDateTime,
    endDateTime,
    travelByPlaneShip,
    destination,
    lessFiveKm,
    lessFifteenKm,
    nightTravel,
    freeMeals,
  } = useAppSelector((state) => state.dailyInput);

  const handleSplitTrip = (startDateTime: string, endDateTime: string) => {
    // Pass the existing days to append new ones
    const updatedDays = splitIntoDays(
      startDateTime,
      endDateTime,
      travelByPlaneShip,
      destination,
      lessFiveKm,
      lessFifteenKm,
      nightTravel,
      freeMeals,
      days, // Existing days
    );

    // Dispatch updated days to Redux
    dispatch(setDays(updatedDays));
  };
  return (
    <>
      {days.length == 0 && (
        <div className="mb-6 mt-6 flex items-center colored-window">
          {/* Description */}
          <label className="mr-8">Description:</label>
          <input
            type="text"
            value={description}
            placeholder="Enter a trip description"
            className="w-2/5 rounded p-2 text-gray-800 border border-gray-500"
            onChange={(e) => dispatch(setDescriptionDaily(e.target.value))}
          ></input>
          {/* Total Box */}
          <div className="ml-auto flex w-1/6 flex-col items-center border border-gray-800 dark:border-gray-200 p-2">
            <span className="text-sm">
              Reimbursement total: {reimbursement} €
            </span>
          </div>
        </div>
      )}
      {/* Overall page */}

      <div className="colored-window grid border-spacing-52 border-2 border-gray-800 dark:border-gray-200 font-openSansBody">
        {/* Collapsible Content */}
        {showInput && <NewDestination />}

        <button
          onClick={() => {
            if (startDateTime && endDateTime)
              handleSplitTrip(startDateTime, endDateTime);
            dispatch(setShowInput());
            dispatch(resetDailyInput());
            console.log("Toggling input visibility");
          }}
          className="mb-6 mr-10 justify-self-end rounded-lg bg-cyan-light-600 dark:bg-blue-dark-300 px-4 py-1 text-gray-200 dark:text-gray-800 dark:hover:bg-blue-dark-800 hover:bg-opacity-75 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Save to report
        </button>
      </div>
    </>
  );
};

// Utility function to split date range into 24-hour periods
function splitIntoDays(
  startDateTime: string,
  endDateTime: string,
  travelByPlaneShip: boolean,
  destination: string,
  lessFiveKm: boolean,
  lessFifteenKm: boolean,
  nightTravel: boolean,
  freeMeals: boolean,
  existingDays: any[],
) {
  const days = [...existingDays]; // Start with the existing days
  let currentStart = new Date(startDateTime);
  const currentEnd = new Date(startDateTime);
  currentEnd.setHours(currentEnd.getHours() + 24);

  const overallEnd = new Date(endDateTime);

  // Set the ID correctly if days array isn't empty
  let id = days.length > 0 ? days[days.length - 1].id + 1 : 1;

  while (currentStart < overallEnd) {
    days.push({
      id: id++, // Increment the id for each new day
      travelByPlaneShip: travelByPlaneShip, // Passed value
      destination: destination, // Passed value
      startDateTime: currentStart.toLocaleString(), // Use locale string
      endDateTime:
        currentEnd <= overallEnd
          ? currentEnd.toLocaleString()
          : overallEnd.toLocaleString(),
      lessFiveKm: lessFiveKm, // Passed value
      lessFifteenKm: lessFifteenKm, // Passed value
      nightTravel: nightTravel, // Passed value
      freeMeals: freeMeals, // Passed value
      allowance: 20,
    });

    currentStart = new Date(currentEnd); // Move the start to the next 24-hour period
    currentEnd.setHours(currentEnd.getHours() + 24); // Move the end 24 hours forward
  }

  return days;
}

export default DailyAllowance;
