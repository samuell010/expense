import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import DailyAllowance from "@/components/DailyAllowance";
import KilometerAllowance from "@/components/KilometerAllowance";
import AdditionalExpenses from "@/components/AdditionalExpenses";
import { useNavigate } from "react-router-dom";
import KmAllowanceSavedData from "@/components/KmAllowanceSavedData";
import AdditionalExpensesSavedData from "@/components/AdditionalExpensesSavedData";
import { KilometerAllowanceEntry, AdditionalExpensesEntry } from "@/Types";
import { useAppDispatch, useAppSelector } from "@/Hooks";
import { setShowInput } from "../store/dailyInputSlice";
import DailyAllowanceReport from "@/components/DailyAllowanceReport";

const ReportEditing: React.FC = () => {
  const [showKilometerAllowance, setShowKilometerAllowance] = useState(false);
  const [showAdditionalExpenses, setShowAdditionalExpenses] = useState(false);
  // const [isKmDataSaved, setIsKmDataSaved] = useState(false); // Track saved status
  //  const [kmData, setKmData] = useState<KilometerAllowanceEntry[]>([]);    // State to track multiple kilometer data entries
  const kmData = useAppSelector((state) => state.kilometerAllowance.entries);
  const showInput = useAppSelector((state) => state.dailyInput.showInput);
  const expenseData = useAppSelector(
    (state) => state.additionalExpenses.entries,
  );
  const { days } = useAppSelector((state) => state.dailyAllowance);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // This function will be called when data is saved in KilometerAllowance
  const handleKmDataSaved = (data: KilometerAllowanceEntry) => {
    //It takes data (of type KilometerAllowanceEntry) as an argument, which represents the saved kilometer allowance data.
    console.log("Kilometer allowance saved:", data);
    setShowKilometerAllowance(false); // Hide the form after saving
  };

  // This function will be called when data is saved in AdditionalExpenses
  const handleAdditionalExpenseDataSaved = (data: AdditionalExpensesEntry) => {
    console.log("Additional expenses saved:", data);
    setShowAdditionalExpenses(false); // Hide the form after saving
  };

//const { isAuthenticated } = useAuth0();

  // Checking if the user is logged in. If not, the user will be directed to the welcome page
  //if (isAuthenticated == false){
    //navigate("/");
  //}

  return (
    <>
      <div className="colored-window min-h-screen font-openSansBody">
        {/* Placeholder for text and icons */}
        <div className="relative flex justify-between p-4">
          <div className="flex-1 border border-gray-800 dark:border-gray-200 p-7">
            {/* Navigation to reports */}
            <div className="flex flex-row space-x-4">
              <p className="flex font-robotoTitle text-xl">
                All data related to your reports is gathered on the reports
                page. To edit or delete any entries, simply click here
              </p>
              <div className="button-neutral flex justify-center px-4">
                <button onClick={() => navigate("/reports")}>
                  {" "}
                  Go to reports
                </button>
              </div>
            </div>
          </div>

          {/* Icons */}
          <div className="mx-8 flex flex-shrink-0 flex-col">
            <span className="my-1 flex">
              <EditIcon className="mx-2" /> <p>Edit title info</p>
            </span>
          </div>
          <span className="absolute inset-x-0 bottom-1 h-0.5 bg-gray-800 dark:bg-gray-200"></span>
        </div>

        {/* Buttons for adding components */}
        <div className="flex flex-col p-6">
          {/* Daily Allowance buttons */}
          <div className="p-3">
            {/* Arrow icon that rotates */}
            <button onClick={() => dispatch(setShowInput())}>
              <span>
                <KeyboardDoubleArrowUpIcon
                  className={`transition-transform duration-500 ${showInput ? "rotate-180" : "rotate-0"}`}
                />
                Daily Allowance / Per Diem
              </span>
            </button>
            <button
              className="button-add m-4 px-5"
              onClick={() => dispatch(setShowInput())}
            >
              <span>
                <AddCircleOutlineIcon /> Add
              </span>
            </button>
            {days.length > 0 && <DailyAllowanceReport />}
            {/* Collapsible Content */}
            {showInput && (
              <div className="overflow-hidden transition-all duration-500">
                <DailyAllowance />
              </div>
            )}
          </div>

          {/* Kilometer Allowance buttons */}
          <div className="p-3">
            {/* Arrow icon that rotates */}
            <button
              onClick={() => setShowKilometerAllowance(!showKilometerAllowance)}
            >
              <span>
                <KeyboardDoubleArrowUpIcon
                  className={`transition-transform duration-500 ${showKilometerAllowance ? "rotate-180" : "rotate-0"}`}
                />{" "}
                Kilometer Allowances
              </span>
            </button>

            {/* Button to add more data */}
            <button
              className="button-add m-4 px-5"
              onClick={() => {
                setShowKilometerAllowance(true);
              }}
            >
              <span>
                <AddCircleOutlineIcon /> Add
              </span>
            </button>

            {kmData.length > 0 && (
              <div className="mx-auto mt-6 overflow-x-auto">
                <table className="min-w-full table-auto border-none">
                  <thead className="bg-blue-dark-300 text-sm text-black">
                    <tr>
                      <th className="whitespace-nowrap px-1 md:px-4 py-2 text-center">
                        Vehicle info
                      </th>
                      <th className="whitespace-nowrap px-1 md:px-4 py-2 text-center">
                        Passengers
                      </th>
                      <th className="whitespace-nowrap px-1 md:px-4 py-2 text-center">
                        Route
                      </th>
                      <th className="whitespace-nowrap px-1 md:px-4 py-2 text-center">
                        Distance
                      </th>
                      <th className="whitespace-nowrap px-1 md:px-4 py-2 text-center">
                        Sum
                      </th>
                      <th className="whitespace-nowrap px-1 md:px-4 py-2 text-center">
                        Unit price
                      </th>
                      <th className="whitespace-nowrap px-1 md:px-4 py-2 text-center">
                        Date
                      </th>
                      <th className="whitespace-nowrap px-1 md:px-4 py-2 text-center ">
                        Passenger names
                      </th>
                      <th className="whitespace-nowrap px-1 md:px-4 py-2 text-center">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {kmData.map((entry, index) => (
                      <KmAllowanceSavedData key={index} data={entry} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {showKilometerAllowance && (
              <div className="overflow-hidden transition-all duration-500">
                <KilometerAllowance onSave={handleKmDataSaved} />
              </div>
            )}
          </div>

          {/* Additional Expenses buttons */}
          <div className="p-3">
            <button
              onClick={() => setShowAdditionalExpenses(!showAdditionalExpenses)}
            >
              <span>
                <KeyboardDoubleArrowUpIcon
                  className={`transition-transform duration-500 ${showAdditionalExpenses ? "rotate-180" : "rotate-0"}`}
                />{" "}
                Additional Expenses
              </span>
            </button>

            {/* Button to add more data */}
            <button
              className="button-add m-4 px-5"
              onClick={() => setShowAdditionalExpenses(true)}
            >
              <span>
                <AddCircleOutlineIcon /> Add
              </span>
            </button>
            {expenseData.length > 0 && (
              <div className="mx-auto mt-6">
                <table className="min-w-full table-auto border-none">
                  <thead className="bg-blue-dark-300 text-sm text-black">
                    <tr>
                      <th className="whitespace-nowrap px-0 py-2 text-center">
                        Expense type
                      </th>
                      <th className="whitespace-nowrap px-0 py-2 text-center">
                        Date of expense
                      </th>
                      <th className="whitespace-nowrap px-0 py-2 text-center">
                        Country
                      </th>
                      <th className="whitespace-nowrap px-0 py-2 text-center">
                        Amount (VAT included)
                      </th>
                      <th className="whitespace-nowrap px-0 py-2 text-center">
                        Description
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 text-center">
                        Attachments
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {expenseData.map((entry, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap px-4 py-2 text-center">
                          {entry.type}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-center">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-center">
                          {entry.country}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-center">
                          {entry.amount} €
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-center">
                          {entry.description}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-center">
                          {entry.attachments.length > 0 ? "Yes" : "No"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {showAdditionalExpenses && (
              <div className="overflow-hidden transition-all duration-500">
                <AdditionalExpenses onSave={handleAdditionalExpenseDataSaved} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportEditing;
