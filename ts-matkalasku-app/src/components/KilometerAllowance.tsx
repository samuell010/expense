import React, { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/Hooks";
import MapSelector from "./MapSelector";
import { FaGlobe, FaInfoCircle } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { HiLocationMarker } from "react-icons/hi";
import "leaflet/dist/leaflet.css";
import {
  setDistance,
  setManualInput,
  setStartPoint,
  setEndPoint,
  setStartLat,
  setStartLng,
  setEndLat,
  setEndLng,
  setMap,
  setStartDateKm,
  setEndDateKm,
  setDescriptionKm,
  setTotalCostKm,
  updatePassengerName,
  setVehicleInfo,
  // updateSavedData,
  addKmAllowance,
  clearKmForm,
} from "../store/kilometersAllowanceSlice";
import NumericTextBoxCount from "./NumericTextBoxCount";
import CustomDatePicker from "@/components-departure/DatePicker/DatePicker";
import config from "../../config.ts";
import KmAllowanceSavedData from "./KmAllowanceSavedData.tsx";
import { KilometerAllowanceEntry } from "@/Types.ts";
import { toast } from "react-toastify";

interface KilometerAllowanceProps {
  onSave?: (data: KilometerAllowanceEntry) => void; // Optional callback
}

const apiKey = config.apiKey;

// Create a cache for geocoding results
const geocodeCache = new Map<string, string>();

// interface KmAllowanceProps {
//   onSave?: (saved: boolean) => void
// }

const KilometerAllowance: React.FC<KilometerAllowanceProps> = ({onSave}) => {
  const dispatch = useAppDispatch(); //typed
  //Access the Redux state
  const {
    reportId,
    distance,
    // unitPrice,
    manualInput,
    startPoint,
    endPoint,
    startLat,
    startLng,
    endLat,
    endLng,
    showMap,
    startDate,
    endDate,
    description,
    totalCost,
    passengerNames,
    passengers,
    vehicleInfo,
    entries,
  } = useAppSelector((state) => state.kilometerAllowance);

  console.log("Updated start date:", startDate);

  const [showPassengerInfo, setShowPassengerInfo] = useState<boolean>(false);
  const [showManualInputInfo, setShowManualInputInfo] =
    useState<boolean>(false);
  const popUpRef = useRef<HTMLDivElement | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [savedData, setSavedData] = useState<KilometerAllowanceEntry | null>(null);
  const unitPrice = 0.5;

   // Close pop-up when clicking outside
   useEffect(()=>{
    const handleClickOutside = (event: MouseEvent) =>{
      if (popUpRef.current && !popUpRef.current.contains(event.target as Node)){
        setShowManualInputInfo(false);
        setShowPassengerInfo(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
   }, [])

  const clearKmAllowanceForm = () => {
    dispatch(clearKmForm())
  }

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0]; // Extract date part (YYYY-MM-DD)
      console.log("Dispatched start date:", formattedDate);
      dispatch(setStartDateKm(formattedDate)); // Dispatch the formatted date string (YYYY-MM-DD)
    } else {
      dispatch(setStartDateKm(null)); // Dispatch null if no date is selected
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0]; // Extract date part (YYYY-MM-DD)
      console.log("Dispatched end date:", formattedDate);
      dispatch(setEndDateKm(formattedDate)); // Dispatch the formatted date string (YYYY-MM-DD)
    } else {
      dispatch(setEndDateKm(null)); // Dispatch null if no date is selected
    }
  };

  //Handle names
  const changePassengerName = (index: number, name: string) => {
    dispatch(updatePassengerName({ index, name }));
  };

  //Handle vehicleInfo
  const handleVehicleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVehicle = event.target.value;
    dispatch(setVehicleInfo(selectedVehicle));
  };

  const geocodeLocation = async (lat: number, lng: number): Promise<string> => {
    const cacheKey = `${lat},${lng}`;
    if (geocodeCache.has(cacheKey)) {
      return geocodeCache.get(cacheKey)!; // Use non-null assertion because we know it exists
    }
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
    );
    const data = await response.json();

    const road = data.address?.road || "Road not available";
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      "City not available";
    const country = data.address?.country || "Country not available";
    const postcode = data.address?.postcode || "Postcode not available";

    const address = `${road}, ${city}, ${postcode}, ${country}`;

    geocodeCache.set(cacheKey, address);
    return address;
  };

  const updatePoint = useCallback(
    async (
      coordinates: { lat: number; lng: number },
      type: "start" | "end",
    ) => {
      const { lat, lng } = coordinates; // Destructure lat and lng

      if (lat == null || lng == null) return;

      // const details = await geocodeLocation(coordinates.lat, coordinates.lng);
      const details = await geocodeLocation(lat, lng);

      if (type === "start") {
        dispatch(setStartLat(lat));
        dispatch(setStartLng(lng));
        dispatch(setStartPoint(details));
      } else {
        // dispatch(setEndCoordinates(coordinates));
        dispatch(setEndLat(lat));
        dispatch(setEndLng(lng));
        dispatch(setEndPoint(details));
      }
      // Close the map after selection
      dispatch(setMap({ show: false, type: null }));
    },
    [dispatch],
  );

  // // Fetch route distance
  useEffect(() => {
    // Dispatch the default value (e.g., "car") when the component mounts
    if (!vehicleInfo) {
      dispatch(setVehicleInfo("car")); // Default value for vehicleInfo
    }

    const calculateAndSetDistance = async () => {
      // if (startCoordinates && endCoordinates) {
      if (
        startLat != null &&
        startLng != null &&
        endLat != null &&
        endLng != null
      ) {
        try {
          // Try to calculate the distance using OpenRouteService API
          const calculatedDistance = await fetchRouteDistance(
            startLat,
            startLng,
            endLat,
            endLng,
          );
          const formattedDistance = parseFloat(calculatedDistance.toFixed(2));
          dispatch(setDistance(formattedDistance));

          // Calculate the total cost based on the new distance
          const calculatedTotalCost = formattedDistance * unitPrice;
          const formattedTotalCost = parseFloat(calculatedTotalCost.toFixed(2));
          dispatch(setTotalCostKm(formattedTotalCost));
        } catch (error) {
          console.error(
            "OpenRouteService failed, calculating manually:",
            error,
          );
          // If OpenRouteService fails, calculate distance manually using Haversine formula
          const calculatedDistance = calculateDistance(
            startLat,
            startLng,
            endLat,
            endLng,
          );
          const formattedDistance = parseFloat(calculatedDistance.toFixed(2));
          dispatch(setDistance(formattedDistance));

          // Calculate the total cost based on the manually calculated distance
          const calculatedTotalCost = formattedDistance * unitPrice;
          const formattedTotalCost = parseFloat(calculatedTotalCost.toFixed(2));
          dispatch(setTotalCostKm(formattedTotalCost));
        }
      }
    };
    calculateAndSetDistance();
  }, [startLat, startLng, endLat, endLng, unitPrice, dispatch, vehicleInfo]);

  const fetchRouteDistance = async (
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
  ): Promise<number> => {
    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startLng},${startLat}&end=${endLng},${endLat}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch route data");
    }
    const data = await response.json();
    console.log("API Response:", data); // Debugging the response structure

    // Extract distance from the correct part of the response
    const distance =
      data.features?.[0]?.properties?.segments?.[0]?.distance || 0;

    if (distance === 0) {
      throw new Error("No routes found in the response");
    }

    return distance / 1000; // Convert from meters to kilometers
  };

  // Manual distance calculation using the Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value >= 0) {
      dispatch(setDistance(value)); //Assuming setDistance is a Redux action
    }
  };

  const handleManualInputChange = () => {
    dispatch(setManualInput(!manualInput));
    if (!manualInput) {
      dispatch(setDistance(0)); // Clear distance when switching to manual input
    }
  };

  // Debounce request to avoid high volume requests

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  //POST request

  const handleKmSave = async () => {
    const kmData: KilometerAllowanceEntry = {
      distance,
      passengers,
      passengerNames,
      startPoint,
      endPoint,
      startLat,
      startLng,
      endLat,
      endLng,
      startDate,
      endDate,
      description,
      totalCost,
      reportId,
      vehicleInfo,
    };
    console.log("Km allowance data:", kmData);
    try {
      const res = await axios.post(
        "http://localhost:3005/api/kilometer-allowances",
        kmData,
        // { entries },  // Send the array of entries
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      //Saved data to Redux to stay in sync with the Redux state and the backend

      dispatch(addKmAllowance(kmData));
// dispatch(updateSavedData(res.data))
setSavedData(res.data);
      // If the data is successfully saved, "isSaved" state to true
      setIsSaved(true);
      if (onSave) {
        onSave(res.data); // Optionally notify parent component
      }
      toast.success("Kilometer-allowance created!")
      console.log("Km allowance data:", kmData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to save kilometer allowance:",
          error.response?.data || error.message,
        );
        toast.error("Something went wrong...");
      } else {
        // Handle other types of errors
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
<>
    <div className="colored-window border-spacing-52 border-2 border-gray-800 dark:border-gray-200 p-6 font-openSansBody">
      <h2 className="mb-4 text-center font-robotoTitle text-xl">
        Add kilometer allowance
      </h2>

      <div className="mb-2 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
        <div className="flex flex-col items-center w-full md:w-1/4 lg:w-1/6">
          {/* MapSelector Start */}
          <label className="mb-2 flex items-center">
            Start point:
            <FaGlobe className="ml-1" />
            <HiLocationMarker className="ml-1" />
          </label>
          <input
            type="text"
            placeholder="Tampere"
            className="rounded border text-gray-800 border-gray-500 p-2 focus:outline-none focus:ring-2 focus:ring-blue-dark-300 w-full"
            readOnly
            value={startPoint || ""}
            onClick={() => dispatch(setMap({ show: true, type: "start" }))}
          />
        </div>
        {/* MapSelector End */}
        <FiArrowRight className="mx-2 text-2xl hidden sm:block" />
        {/* <div className="flex w-1/6 flex-col items-center"> */}
        <div className="flex flex-col items-center w-full md:w-1/4 lg:w-1/6">
          <label className="mb-2 flex items-center">
            End point:
            <FaGlobe className="ml-1" />
            <HiLocationMarker className="ml-1" />
          </label>
          <input
            type="text"
            placeholder="Helsinki"
            className="rounded border text-gray-800 border-gray-500 p-2 focus:outline-none focus:ring-2 focus:ring-blue-dark-300 w-full"
            readOnly
            value={endPoint || ""}
            onClick={() => dispatch(setMap({ show: true, type: "end" }))}
          />
        </div>
        {/* manual km input */}
        <div className="flex flex-col items-center w-full md:w-1/4 lg:w-1/6">
          <label className="mb-2">Distance (km):</label>
          <input
            type="number"
            value={distance}
            onChange={handleDistanceChange}
            className="w-20 rounded border text-gray-800 border-gray-500 p-2 focus:outline-none focus:ring-2 focus:ring-blue-dark-300"
            readOnly={!manualInput}
          />
        </div>
        <div className="flex flex-col items-center w-full md:w-1/4 lg:w-1/6">
          <label className="mb-2 flex items-center">Vehicle information:</label>
          <select
            className="h-10 w-full rounded text-gray-800 border border-gray-500 bg-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-dark-300"
            value={vehicleInfo} 
            onChange={handleVehicleChange} // Handle the change and dispatch it to Redux
          >
            <option value="car">Passenger car</option>
            <option value="motorcycle">Motorcycle</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <div className="flex flex-col items-center w-full sm:w-1/3 lg:w-1/6">

            <label className="mb-2 flex items-center">
              Passengers:
              <FaInfoCircle
                className="ml-1 cursor-pointer"
                onClick={() => setShowPassengerInfo(!showPassengerInfo)}
              />
            </label>
            <div className="flex text-gray-800 border border-gray-500 dark:border-transparent flex-col items-center focus:outline-none focus:ring-2 focus:ring-blue-dark-300 w-full sm:w-2/3 md:w-1/2">
              <NumericTextBoxCount />

              {showPassengerInfo && (
                <div 
                ref={popUpRef}
                className="absolute border border-gray-500 mt-2 w-64 rounded bg-white dark:bg-gray-200 p-2 shadow-lg">
                  This field allows you to specify the number of passengers but without a driver.
                </div>
              )}
            </div>
     
        </div>
        {/* Total Box */}
        <div className="flex flex-col items-center border border-gray-800 dark:border-gray-200 p-4 w-full md:w-1/4 lg:w-1/6">
          <span>Total: {totalCost} €</span>
          <span className="mt-2 text-sm">
            Unit price: {unitPrice.toFixed(2)} €/km
          </span>
        </div>
      </div>
      {/* Show Map */}
      {showMap.show && (
        <MapSelector
          center={[61.4978, 23.761]}
          zoom={6}
          onLocationSelect={debounce(
            (coordinates: { lat: number; lng: number }) => {
              if (showMap.type === "start") {
                updatePoint(coordinates, "start");
              } else if (showMap.type === "end") {
                updatePoint(coordinates, "end");
              }
            },
            500,
          )} // Adjust the debounce delay as needed
          onClose={() => dispatch(setMap({ show: false, type: null }))}
          // popupInfo={popupInfo} // Pass the popup info explicitly
        />
      )}

      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          checked={manualInput}
          onChange={handleManualInputChange}
          className="mr-2"
        />
        <label className="flex items-center">
          Manual km input
          <FaInfoCircle
            className=" ml-1 cursor-pointer" //relative
            onClick={() => setShowManualInputInfo(!showManualInputInfo)}
          />
           </label>
          {showManualInputInfo && (
            <div 
            ref={popUpRef}
            className="absolute border border-gray-500 text-gray-800 mt-16 ml-44 w-64 rounded bg-white dark:bg-gray-200 p-1 shadow-lg">
              Use this option to manually enter the distance in kilometers.
            </div>
          )}
       
      </div>

      {/* Description, date and time, buttons container */}
      <div className="flex flex-col md:flex-row w-full justify-between">
        {/* Description */}
        <div className="mt-4 flex w-1/3 flex-col items-center">
          <label className="mb-2">Description:</label>
          <input
            type="text"
            placeholder="Enter a trip description"
            className="w-full rounded border border-gray-500 p-2 text-blue-dark-950 focus:outline-none focus:ring-2 focus:ring-blue-dark-300"
            value={description}
            onChange={(e) => dispatch(setDescriptionKm(e.target.value))}
          ></input>
        </div>

        {/* Date and time */}
        <div className="mt-4 flex flex-col items-center">
          <div className="mb-2">
            <label htmlFor="date"> Date & Time:</label>
          </div>

          <div className="flex items-center gap-x-4">
            <CustomDatePicker
              selectedDate={startDate ? new Date(startDate) : null} // Pass Date object or null to DatePicker
              onDateChange={(date) => {
                handleStartDateChange(date);
                // handleStartTimeChange(date);
              }}
              dateFormat="yyyy-MM-dd HH:mm"
            />

            {/* End Date */}
            <CustomDatePicker
              selectedDate={endDate ? new Date(endDate) : null} // Pass Date object or null to DatePicker
              onDateChange={(date) => {
                handleEndDateChange(date);
                // handleEndTimeChange(date);
              }}
              dateFormat="yyyy-MM-dd HH:mm"
            />
          </div>
        </div>

        {/* Passenger names input fields */}

        {passengers > 0 && (
          <div className="mt-4 flex flex-col items-center">
            <p className="mb-2">Passenger names:</p>
            <div className="flex flex-col">
              {Array.from({ length: passengers }, (_, index) => (
                <input
                  key={index}
                  type="text"
                  className="mb-2 w-full rounded border border-gray-500 p-2 font-thin text-black focus:outline-none focus:ring-2 focus:ring-blue-dark-300"
                  placeholder={`Passenger ${index + 1} name`}
                  value={passengerNames[index] || ""}
                  onChange={(e) => changePassengerName(index, e.target.value)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Buttons container */}

        <div className="flex flex-col ">
          <button className="mt-4 rounded-lg px-4 py-1 text-red-700 outline outline-red-800 bg-gray-200 dark:bg-red-900 dark:text-gray-200 dark:outline-none w-full sm:w-auto"
          onClick={clearKmAllowanceForm}>
              Clear the form
          </button>
          {/* onClick={handleKmSave} */}
          <button
            className="mt-4 rounded-lg px-4 py-1 bg-cyan-light-600 dark:bg-blue-dark-300 text-gray-200 dark:text-gray-800 dark:hover:bg-blue-dark-800 hover:bg-opacity-75 hover:text-gray-800 dark:hover:text-gray-200 w-full sm:w-auto"
            onClick={handleKmSave}
          >
            Save to report & close
          </button>
                 
        </div>
      </div>
    </div>
    </>
  );
  
};

export default KilometerAllowance;
