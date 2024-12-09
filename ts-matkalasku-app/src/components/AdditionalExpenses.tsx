import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setTypeCost,
  setDescriptionCost,
  setDateCost,
  setAmount,
  setCountry,
  setSumCost,
  setVatPercent,
  setCommentCost,
  setAttachment,
  addAdditionalExpenses,
  addAttachment,
} from "../store/additionalExpenseSlice";
import { useAppSelector } from "@/Hooks";
import AdditionalExpensesSavedData from "./AdditionalExpensesSavedData";
import { AdditionalExpensesEntry } from "@/Types";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface AdditionalExpensesProps {
  onSave?: (data: AdditionalExpensesEntry) => void; // Optional callback
}

const AdditionalExpenses: React.FC<AdditionalExpensesProps> = ({ onSave }) => {
  const dispatch = useDispatch();

  // Get the current state from Redux
  const {
    reportId,
    typeCost,
    descriptionCost,
    dateCost,
    amount,
    country,
    sumCost,
    vatPercent,
    commentCost,
    attachments,
  } = useAppSelector((state) => state.additionalExpenses);

  console.log("Current Report ID:", reportId); // Check if the reportId is correctly retrieved from Redux

  //Local state to control the input
  // const [value, setValue] = useState<string>('');
  // const [selectedFiles, setSelectedFiles] = useState<string[]>(
  //   attachments || [],
  // );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [description, setDescription] = useState(descriptionCost);
  const [comment, setComment] = useState(commentCost);

  const [selectedDate, setSelectedDate] = useState<string>(dateCost || "");
  const [vat, setVat] = useState(vatPercent);
  const [value, setValue] = useState<string>(amount ? amount.toString() : "");
  const [sum, setSum] = useState("");

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [savedData, setSavedData] = useState<AdditionalExpensesEntry | null>(
    null,
  );
  const additionalExpenseState = useSelector(
    (state) => state.additionalExpenses,
  );
  const attachmentsFromRedux = useSelector(
    (state) => state.additionalExpenses.attachments,
  );

  const handleImgUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      alert("Please select one or more images to upload");
      return;
    }

    try {
      // Create a FormData object and append all selected files
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file); // Make sure the field name matches what the backend expects
      });

      // Send a single fetch request with all files
      const response = await fetch("http://localhost:3005/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Uploaded:", data);

        // Assuming each file has `imageName` and `imageUrl` in the response
        // Here, you can dispatch an action to store the uploaded attachments in your state
        // Example: data.files would contain an array of uploaded file information
        data.uploadResults.forEach((file) => {
          dispatch(addAttachment(file)); // Assuming you have an action to add each attachment
        });
        toast.success("Files uploaded successfully!");
      } else {
        toast.error("File upload failed");
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  console.log("Full Redux State:", additionalExpenseState);

  //Sync local state with Redux state when component mounts or Redux state changes
  useEffect(() => {
    // Handle `dateCost`
    if (dateCost) {
      setSelectedDate(dateCost); // Set the local state
    } else {
      const today = new Date().toISOString().split("T")[0]; // Default to today's date in 'YYYY-MM-DD' format
      setSelectedDate(today);
      dispatch(setDateCost(today)); // Dispatch the initial date to Redux
    }

    // Handle `amount`
    // Sync with Redux state when the component mounts or when `amount` changes
    if (amount) {
      setValue(amount.toString()); // Initialize local state from Redux
    }

    // Handle 'sumCost'
    if (amount & vatPercent) {
      const calculatedSum = (amount * (100 - vatPercent)) / 100;
      setSum(calculatedSum.toFixed(2)); // Update local state for sum, formatted to 2 decimal
      dispatch(setSumCost(calculatedSum)); // Dispatch the sum to Redux
    }
  }, [dispatch, amount, dateCost, vatPercent]);

  // Handle the amount change event
  // Checks that the value in "Amount" is an integer
  const handleAmountChange = (
    inputEvent: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputValue = inputEvent.target.value;
    if (/^\d*$/.test(inputValue)) {
      setValue(inputValue); // Update local state
      dispatch(setAmount(parseFloat(inputValue))); // Update Redux state
    }
  };

  // Checks that the value in "Sum" is an integer
  const handleSumChange = (inputEvent: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = inputEvent.target.value;
    if (/^\d*\.?\d*$/.test(inputValue)) {
      setSum(inputValue);
      dispatch(setSumCost(parseFloat(inputValue)));
    }
  };

  const handleExpenseTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTypeCost(e.target.value));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCountry(e.target.value));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value); // update local state
    dispatch(setCommentCost(e.target.value)); // Dispatch Redux action to update global state
  };

  const handleVatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vatValue = Number(e.target.value); // Convert string to number
    setVat(vatValue);
    dispatch(setVatPercent(vatValue));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    dispatch(setDescriptionCost(e.target.value));
  };

  // Handles the files
  // const handleFileChange = (
  //   inputEvent: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   const files = inputEvent.target.files;

  //   if (files) {
  //     // Convert the FileList to an array of file names
  //     const fileArray = Array.from(files).map((file) => file.name); // If you need the file name
  //     setSelectedFiles(fileArray); // Update local state
  //     dispatch(setAttachment(fileArray)); // Dispatch Redux action if needed
  //   }
  // };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      // Append the newly selected files to the existing list
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
    }
  };
  // counts the amount of the files
  const fileCount = selectedFiles ? selectedFiles.length : 0;

  // List to loop for the expense options
  const expenseOptions = [
    { value: "taxi", label: "Taxi" },
    { value: "accommodation", label: "Accommodation" },
    { value: "publicTransportation", label: "Public Transportation" },
    { value: "parkingFees", label: "Parking Fees" },
    { value: "meal", label: "Meal" },
    { value: "restaurant", label: "Restaurant" },
    { value: "businessMeals", label: "Business Meals" },
    { value: "internet", label: "Internet" },
    { value: "travelInsurance", label: "Travel Insurance" },
    { value: "communication", label: "Communication" },
    { value: "carRent", label: "Car Rent" },
    { value: "fuel", label: "Fuel" },
    // Add more options as needed
  ];

  const handleExpenseSave2 = async () => {
    const expenseData = {
      type: typeCost,
      date: new Date(selectedDate).toISOString(),
      amount: parseFloat(value),
      country,
      vat: parseFloat(vat.toString()),
      sum: parseFloat(sum),
      description: descriptionCost,
      comment: comment,
      reportId,
      attachments: attachmentsFromRedux.map((file) => ({
        fileName: file.fileName,
        url: file.url, // Adjust this if your attachment object has a different structure
      })),
    };

    try {
      const res = await axios.post(
        "http://localhost:3005/api/other-expenses",
        expenseData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      // Check if response is OK (status code 2xx)
      if (res.status >= 200 && res.status < 300) {
        console.log("Expense saved successfully:", res.data);

        toast.success("New additional expense created");
        // Handle the successful response here (e.g., update state, show a success message, etc.)
      } else {
        console.error("Error saving expense:", res.data);
        toast.error("Expense creation failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to save additional expense:",
          error.response?.data || error.message,
        );
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  //POST request
  const handleExpenseSave = async () => {
    const expenseData = {
      reportId,
      type: typeCost,
      date: selectedDate ? new Date(selectedDate).toISOString() : "",
      amount: parseFloat(value),
      country,
      vat: parseFloat(vat.toString()),
      sum: parseFloat(sum),
      description,
      comment: commentCost,
      attachments: selectedFiles.length > 0 ? selectedFiles : [], // Assuming attachments is an array
      // ...(selectedFiles.length > 0 && { attachments: selectedFiles }), // Only include attachments if there are files
    };
    console.log("Additional expense data:", expenseData);
    try {
      const res = await axios.post(
        "http://localhost:3005/api/other-expenses",
        expenseData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      //Saved data to Redux to stay in sync with the Redux state and the backend
      dispatch(addAdditionalExpenses(expenseData));
      // dispatch(updateSavedData(res.data))
      setSavedData(res.data);
      // If the data is successfully saved, "isSaved" state to true
      setIsSaved(true);

      // Call the onSave prop to notify the parent that data is saved
      //  onSave(true);  // Notify the parent
      if (onSave) {
        onSave(res.data); // Optionally notify parent component
      }
      toast.success("New additional expense created");
      console.log("Additional expense data:", expenseData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to save kilometer allowance:",
          error.response?.data || error.message,
        );
      } else {
        // Handle other types of errors
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <div>
      {/* White border */}
      <div className="w-full pb-4 border-2 border-gray-800 colored-window dark:border-gray-200">
        {/* Top half of additional expenses */}
        <div className="flex flex-col p-4 pb-12">
          {/* Title row */}

          <div className="flex w-full font-robotoTitle">
            <div className="flex items-center justify-center flex-1 text-center">
              Expense:
            </div>
            <div className="flex items-center justify-center flex-1 text-center">
              Date:
            </div>
            <div className="flex items-center justify-center flex-1 text-center">
              Amount (VAT included):
            </div>
            <div className="flex items-center justify-center flex-1 text-center">
              Country:
            </div>
            <div className="flex items-center justify-center flex-1 text-center">
              VAT%:
            </div>
            <div className="flex items-center justify-center flex-1 text-center">
              Sum:
            </div>
            <div className="flex items-center justify-center flex-1 text-center">
              Attachments:
            </div>
          </div>

          {/* options row */}
          <div className="flex w-full mt-4 text-center">
            {/* Expense section */}
            <div className="flex-1 px-6 py-4">
              {/* Loops the expenseOptions items to display in the dropbox */}
              <select
                className="w-full h-10 p-2 text-gray-800 bg-white border border-gray-800 rounded"
                value={typeCost} //bind the selected value from Redux state
                onChange={handleExpenseTypeChange}
              >
                {" "}
                //Handle the change event for single selection
                {expenseOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Date section */}
            <div className="flex-1 px-6 py-4">
              <input
                type="date"
                className="w-full h-10 p-2 text-gray-800 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDate || dateCost}
                onChange={(e) => {
                  const formattedDate = e.target.value;
                  setSelectedDate(formattedDate); // Update local state
                  dispatch(setDateCost(formattedDate)); // Update Redux state
                }}
              />
            </div>
            {/* Amount section */}
            <div className="flex-1 px-6 py-4">
              <input
                type="number"
                className="w-16 p-2 text-gray-800 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={value}
                onChange={handleAmountChange}
              />
            </div>
            {/* Country section */}
            <div className="flex-1 px-6 py-4">
              <select
                className="h-10 p-2 px-10 text-gray-800 bg-white border border-gray-800 rounded-lg"
                value={country}
                onChange={handleCountryChange}
              >
                <option value="finland">Finland</option>
                <option value="spain">Spain</option>
                {/* Add more options as needed */}
              </select>
            </div>
            {/* VAT% section */}
            <div className="flex-1 px-6 py-4">
              <input
                type="number"
                className="p-2 text-gray-800 border border-gray-800 rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={vat}
                onChange={handleVatChange}
              />
            </div>
            {/* Sum section */}
            <div className="flex-1 px-6 py-4">
              {/* <input
                    type="number"
                    // className="p-2 text-gray-800 border border-gray-800 rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    className="w-full p-0 text-gray-800 bg-transparent border-none appearance-none focus:outline-none focus:ring-0" // No border, background, or default input styles
                    value={sumCost || sum} // Use sumCost from Redux if available, or fall back to local state
                    readOnly // Make it read-only since it's calculated automatically
                    onChange={handleSumChange}
                  /> */}
              {/* The € sign, might need to modify on smaller screens */}
              {/* <span className="absolute inset-y-0 flex items-center pr-3 text-gray-500 pointer-events-none right-14">
                    €
                  </span> */}

              <div className="flex items-center justify-center w-full p-2">
                <span>{sumCost || sum}</span> {/* Display the sum */}
                <span className="ml-1">€</span>{" "}
                {/* Display the euro sign next to the sum */}
              </div>
            </div>
            {/* File Attachments section */}
            <div className="flex flex-col flex-1 px-6 py-4 space-x-6 gap-y-2">
              <div className="flex items-center justify-between">
                <span>{fileCount} files</span>
                <div>
                  <label className="flex items-center justify-center w-10 h-10 text-gray-200 rounded cursor-pointer bg-cyan-light-600 dark:bg-blue-dark-800">
                    <input
                      type="file"
                      id="file"
                      name="files"
                      accept=".pdf, .png, .jpg, .jpeg"
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                    />
                    <span className="text-xl">+</span>
                  </label>
                </div>
              </div>
              <button
                className="px-3 py-1 bg-green-600 rounded-xl"
                onClick={handleImgUpload}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
        {/* Top half of additional expenses ends */}

        {/* Bottom half of additional expenses begins */}
        <div className="flex">
          {/* Desctription section */}
          <div className="flex w-1/2">
            <span className="pt-1 text-lg px-7">Description:</span>
            <input
              id="description"
              type="text"
              value={description}
              placeholder="Example: Taxi from Porvoo to Helsinki airport."
              className="w-3/5 p-2 text-gray-800 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleDescriptionChange}
            />
          </div>
          {/* Comment section */}
          <div className="flex w-1/2">
            <span className="px-3 pt-1 text-lg">Comment:</span>
            <input
              id="comment"
              type="text"
              value={comment} //Use local state to control input
              onChange={handleCommentChange} //Handle changes and dispatch action
              placeholder="Example: 11.00-11.50"
              className="w-3/5 p-2 text-black border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            className="px-4 py-1 mt-4 mr-4 text-gray-200 rounded-lg bg-cyan-light-600 hover:bg-opacity-75 hover:text-gray-800 dark:bg-blue-dark-300 dark:text-gray-800 dark:hover:bg-blue-dark-800 dark:hover:text-gray-200"
            onClick={handleExpenseSave2}
          >
            Save to report & close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalExpenses;
