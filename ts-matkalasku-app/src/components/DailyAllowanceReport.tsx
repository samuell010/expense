import { useAppDispatch, useAppSelector } from "@/Hooks";
import {
  setDescriptionDaily,
  deleteDay,
  updateDayInRedux,
} from "@/store/dailyAllowanceSlice";
import React, { useState } from "react";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineSaveAlt } from "react-icons/md";

const DailyAllowanceReport: React.FC = () => {
  const { days, description, reimbursement } = useAppSelector(
    (state) => state.dailyAllowance,
  );
  console.log("destination", days);
  const dispatch = useAppDispatch();

  // Track edit state for each day using id
  const [editId, setEditId] = useState<number | null>(null);

  // Handle delete 24 hour periods
  const handleDelete = (id: number) => {
    dispatch(deleteDay(id)); // Dispatch action to delete the day from Redux
  };

  // Handle checkbox and country changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    field: string,
  ) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    // Dispatch the change directly to Redux
    dispatch(updateDayInRedux({ id, [field]: value }));
  };

  // Save to Redux and stop editing
  const handleSave = () => {
    setEditId(null); // Exit edit mode
  };

  return (
    <>
      <div className="mt-6 flex items-center">
        {/* Description */}
        <label className="mr-8">Description:</label>
        <input
          type="text"
          value={description}
          placeholder="Enter a trip description"
          className="w-2/5 rounded p-2 text-black"
          onChange={(e) => dispatch(setDescriptionDaily(e.target.value))}
        ></input>
        {/* Total Box */}
        <div className="ml-auto flex w-1/6 flex-col items-center border border-white p-2">
          <span className="text-sm">
            Reimbursement total: {reimbursement} €
          </span>
        </div>
      </div>
      <div className="mx-auto mt-6">
        <table className="min-w-full table-auto border-none">
          <thead className="bg-blue-dark-300 text-sm text-black">
            <tr>
              <th className="whitespace-nowrap px-2 py-2 text-center"></th>
              <th className="whitespace-nowrap px-4 py-2 text-center">
                Day of travel start
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-center">
                Day of travel end
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-center">
                Total allowance
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-center">
                Country
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-center">
                Traveling by plane/ship
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-center">
                Free meals
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-center">
                Night travel allowance
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-center">
                Less 5 km
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-center">
                Less 15 km
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-center"></th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {days &&
              days.map((day) => (
                <tr
                  key={day.id}
                  className="text-center focus:outline-none focus:ring focus:ring-blue-dark-300"
                  tabIndex={0}
                >
                  {/* Edit/Save Button */}
                  <td className="px-2 py-2">
                    {editId === day.id ? (
                      <MdOutlineSaveAlt
                        className="cursor-pointer text-center text-lg"
                        onClick={() => handleSave()} // Safe because of editId comparison
                      />
                    ) : (
                      <GoPencil
                        className="cursor-pointer text-center text-lg"
                        onClick={() => setEditId(day.id)} // Enter edit mode
                      />
                    )}
                  </td>

                  <td className="px-4 py-2">{day.startDateTime}</td>
                  <td className="px-4 py-2">{day.endDateTime}</td>
                  <td className="px-4 py-2">{day.allowance} €</td>
                  <td className="p-1 px-4 py-2">
                    {editId !== day.id ? (
                      day.destination
                    ) : (
                      <input
                        type="text"
                        className="w-14 text-center text-blue-950 focus:ring-blue-dark-300"
                        value={day.destination}
                        disabled={editId !== day.id} // Only editable if in edit mode
                        onChange={(e) =>
                          handleChange(e, day.id as number, "destination")
                        }
                      />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={day.travelByPlaneShip}
                      disabled={editId !== day.id} // Only editable if in edit mode
                      onChange={(e) =>
                        handleChange(e, day.id as number, "travelByPlaneShip")
                      }
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={day.freeMeals}
                      disabled={editId !== day.id} // Only editable if in edit mode
                      onChange={(e) =>
                        handleChange(e, day.id as number, "freeMeals")
                      }
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={day.nightTravel}
                      disabled={editId !== day.id}
                      onChange={(e) =>
                        handleChange(e, day.id as number, "nightTravel")
                      }
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={day.lessFiveKm}
                      disabled={editId !== day.id}
                      onChange={(e) =>
                        handleChange(e, day.id as number, "lessFiveKm")
                      }
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={day.lessFifteenKm}
                      disabled={editId !== day.id}
                      onChange={(e) =>
                        handleChange(e, day.id as number, "lessFifteenKm")
                      }
                    />
                  </td>
                  {day.id && (
                    <td className="px-2 py-2">
                      <RiDeleteBin6Line
                        className="cursor-pointer text-center text-lg"
                        onClick={() => handleDelete(day.id as number)} // Delete action
                      />
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DailyAllowanceReport;
