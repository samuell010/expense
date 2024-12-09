import CustomDatePicker from "@/components-departure/DatePicker/DatePicker";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setReportId as setKmReportId } from "@/store/kilometersAllowanceSlice";
import { setReportId as setAdditionalReportId } from "@/store/additionalExpenseSlice";
import { resetKilometerAllowance } from "@/store/kilometersAllowanceSlice";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
//import { useAuth0 } from "@auth0/auth0-react";

interface IntialReport {
  description: string;
  startDate: Date;
  endDate: Date;
}

/* window.addEventListener("beforeunload", function (e) {
  var confirmationMessage =
    "It looks like you have been editing something. " +
    "If you leave before saving, your changes will be lost.";

  (e || window.event).returnValue = confirmationMessage;
  return confirmationMessage;
}); */

const NewTrip: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Reset kilometerAllowance when this page is loaded
  useEffect(() => {
    dispatch(resetKilometerAllowance()); // Clear kilometerAllowance state
  }, [dispatch]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addReport = useMutation({
    mutationFn: () => postReport(),
    onError: (error) => {
      // if (Array.isArray(error)) {
      //   setErrMsg(error.map(err => `• ${err}`).join("\n"));
      // }
      toast.error(error.message)
      
    },
    onSuccess: () => {
      toast.success("Report created!")
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  const postReport = async () => {
    const reportData = {
      ...formData,
      startDate: startDate,
      endDate: endDate,
    };

    try {
      const response = await fetch("http://localhost:3005/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        const data = await response.json();
        const { id, startDate } = data;
        // console.log("Start data", startDate);
        // console.log("ID exist", id);
        // alert(`Report submitted successfully: ${data.message} with ID: ${id}`);
        // Dispatch the reportId to the Redux store
        // dispatch(setReportId(id));
        dispatch(setKmReportId(id)); // For kilometer allowance slice
        dispatch(setAdditionalReportId(id)); // For additional expenses slice
        // console.log("Report ID dispatched:", id); // Add this for debugging
        navigate("/reportedit");
      } else {
        throw new Error(
          `Failed to submit report - ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      console.error(error);

      throw error;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission (page reload)
    addReport.mutate(); // Trigger the mutation
  };

  /*   const { isAuthenticated } = useAuth0();

  // Checking if the user is logged in. If not, the user will be directed to the welcome page
  if (isAuthenticated == false) {
    navigate("/");
  } */

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen colored-window font-openSansBody">
        <div className="max-w-lg w-96 md:w-full">
          <form onSubmit={handleSubmit}>
            <div>
              <span className="flex mb-6 space-x-5">
                <label className="w-1/4" htmlFor="title">
                  {" "}
                  Title:
                </label>
                <input
                  type="text"
                  placeholder="New Business Trip"
                  className="w-3/4 p-2 border border-gray-500 rounded-md text-blue-950 placeholder:font-light placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-dark-300"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </span>

              <span className="flex mb-6 space-x-5">
                <label className="w-1/4" htmlFor="text">
                  {" "}
                  Description:
                </label>
                <textarea
                  placeholder="Enter description"
                  className="w-3/4 p-2 border border-gray-500 rounded-md text-blue-950 placeholder:font-light placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-dark-300"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </span>

              <span className="flex items-center justify-between mb-6 space-x-5">
                <label className="w-1/4" htmlFor="date">
                  {" "}
                  Duration:
                </label>
                <div className="flex w-3/4 space-x-5">
                  <div className="flex flex-col items-center">
                    <p>From</p>

                    <CustomDatePicker
                      selectedDate={startDate}
                      onDateChange={setStartDate}
                      dateFormat="yyyy/MM/dd"
                    />
                  </div>

                  <div className="flex flex-col items-center">
                    <p>To</p>

                    <CustomDatePicker
                      selectedDate={endDate}
                      onDateChange={setEndDate}
                      dateFormat="yyyy/MM/dd"
                    />
                  </div>
                </div>
              </span>

              <div className="flex justify-center mt-8 ml-36">
                <button type="submit" className="w-32 button-neutral">
                  Save
                </button>
              </div>
              <p></p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewTrip;
