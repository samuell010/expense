import { useState } from "react";
import CustomDatePicker from "@/components-departure/DatePicker/DatePicker";
import TimezoneSelect, { type ITimezone } from "react-timezone-select";
import { FaInfoCircle } from "react-icons/fa";
import {
  setTravelByPlaneShip,
  setDestination,
  setStartDateTimeDaily,
  setEndDateTimeDaily,
  setLessFiveKm,
  setLessFifteenKm,
  setNightTravel,
  setFreeMeals,
} from "../store/dailyInputSlice";
import { useAppDispatch, useAppSelector } from "@/Hooks";

const NewDestination: React.FC = () => {
  const dispatch = useAppDispatch();
  //Access the Redux state
  const {
    travelByPlaneShip,
    destination,
    startDateTime,
    endDateTime,
    lessFiveKm,
    lessFifteenKm,
    nightTravel,
    freeMeals,
  } = useAppSelector((state) => state.dailyInput);
  //in redux initial period is stored in UTC zone, use toLocalString to convert to browser time
  if (startDateTime && endDateTime) {
    console.log(
      "selected destination",
      new Date(startDateTime).toLocaleString(),
      new Date(endDateTime).toLocaleString(),
    );
  }

  //set time zones later, currently we'll use browser time
  const [startTimezone, setStartTimezone] = useState<ITimezone>(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [endTimezone, setEndTimezone] = useState<ITimezone>(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  //handle mode of taravelling by plane or ship
  const handleTravelingByPlane = () => {
    dispatch(setTravelByPlaneShip(!travelByPlaneShip));
  };

  //Handle destination
  const handleDestination = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDestination = event.target.value;
    dispatch(setDestination(selectedDestination));
  };

  //Handle both start and end date change
  const handleDateTimeChange = (date: Date | null, type: "start" | "end") => {
    const formattedDate = date ? date.toISOString() : null; // Extract date part (YYYY-MM-DD)
    // Dispatch based on the type (start or end)
    if (type === "start") {
      dispatch(setStartDateTimeDaily(formattedDate)); // Dispatch for start date
    } else if (type === "end") {
      dispatch(setEndDateTimeDaily(formattedDate)); // Dispatch for end date
    }
  };

  //handle less 5 km from work/home
  const handleLessFiveKm = () => {
    dispatch(setLessFiveKm(!lessFiveKm));
  };
  //handle less 15 km from work/home
  const handleLessFifteenKm = () => {
    dispatch(setLessFifteenKm(!lessFifteenKm));
  };
  //handle night travel allowance
  const handleNightTravel = () => {
    dispatch(setNightTravel(!nightTravel));
  };
  //handle free meals
  const handleFreeMeals = () => {
    dispatch(setFreeMeals(!freeMeals));
  };

  return (
    <>
      {/* Overall flex container */}
      <div className="mt-6 flex">
        {/* Left half of page */}
        <div className="w-1/2 px-4">
          <div className="m-6 flex items-center space-x-8">
            {/* Travel by plane/ship toggle */}
            <label className="w-1/4">Traveling by plane/ship:</label>
            <input
              type="checkbox"
              checked={travelByPlaneShip}
              onChange={handleTravelingByPlane}
            ></input>
          </div>

          <div className="m-6 flex items-center space-x-8">
            {/* Destination or location */}
            {travelByPlaneShip && <label className="w-1/4">Destination:</label>}
            {!travelByPlaneShip && <label className="w-1/4">Location:</label>}
            <select
              className="rounded p-2 text-black border border-gray-500"
              value={destination} // The value should come from Redux state
              onChange={handleDestination}
            >
              {" "}
              // Handle the change and dispatch it to Redux
              <option>Select a country</option>
              <option>Finland</option>
              <option>The United Kingdom</option>
            </select>
          </div>

          <div className="m-6 flex items-center space-x-8">
            <label className="w-1/4">Trip starts:</label>
            <div className="">
              <CustomDatePicker
                selectedDate={startDateTime ? new Date(startDateTime) : null} // Pass Date object or null to DatePicker
                onDateChange={(date) => {
                  handleDateTimeChange(date, "start");
                }}
                dateFormat="yyyy-MM-dd HH:mm"
              />
            </div>
            <div className="w-1/4 text-black">
              <TimezoneSelect
                value={startTimezone}
                onChange={setStartTimezone}
              />
            </div>
          </div>

          <div className="m-6 flex items-center space-x-8">
            <label className="w-1/4">Trip ends:</label>
            <div>
              <CustomDatePicker
                selectedDate={endDateTime ? new Date(endDateTime) : null} // Pass Date object or null to DatePicker
                onDateChange={(date) => {
                  handleDateTimeChange(date, "end");
                }}
                dateFormat="yyyy-MM-dd HH:mm"
              />
            </div>
            <div className="w-1/4 text-black">
              <TimezoneSelect value={endTimezone} onChange={setEndTimezone} />
            </div>
          </div>
          {/* Offdays checkbox */}
          <div className="ml-6 flex items-center">
            <input type="checkbox" className="mr-2" />
            <label className="flex items-center">
              Add off-days
              <FaInfoCircle className="relative ml-1 cursor-pointer" />
            </label>
          </div>
        </div>
        {/* Right half of page */}
        <div className="w-1/2">
          {/* Checkboxes container */}
          <div className="px-4">
            <div className="m-6 flex items-center space-x-8">
              <label className="w-1/2">
                Destination less than 5 km from regular workplace
              </label>
              <input
                type="checkbox"
                checked={lessFiveKm}
                onChange={handleLessFiveKm}
              ></input>
            </div>
            <div className="m-6 flex items-center space-x-8">
              <label className="w-1/2">
                Destination less than 15 km from regular workplace & home
              </label>
              <input
                type="checkbox"
                checked={lessFifteenKm}
                onChange={handleLessFifteenKm}
              ></input>
            </div>
            <div className="m-6 flex items-center space-x-8">
              <label className="w-1/2">Provided meals</label>
              <input
                type="checkbox"
                checked={nightTravel}
                onChange={handleNightTravel}
              ></input>
            </div>
            <div className="m-6 flex items-center space-x-8">
              <label className="w-1/2">Night travel allowance</label>
              <input
                type="checkbox"
                checked={freeMeals}
                onChange={handleFreeMeals}
              ></input>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewDestination;
