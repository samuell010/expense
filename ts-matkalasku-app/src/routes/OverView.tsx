import PdfGenerator from "@/components/PdfGenerator";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
//import { useAuth0 } from "@auth0/auth0-react";
import { FaFilePdf } from "react-icons/fa6";

interface KilometerAllowance {
  id: number;
  startPoint: string;
  endPoint: string;
  description: string;
  vehicleInfo: string;
  route: string[];
  distance: number;
  startDate: string;
  endDate: string;
  passengers: number;
  passengerNames: string[];
  totalCost: number;
}

interface DailyAllowance {
  id: number;
  startDateTime: string;
  endDateTime: string;
  travelByPlaneShip: boolean;
  destination: string;
  lessFiveKm: boolean;
  lessFifteenKm: boolean;
  nightTravel: boolean;
  freeMeals: boolean;
}

interface OtherExpense {
  id: number;
  type: string;
  date: string;
  amount: number;
  country: string;
  vat: number;
  sum: number;
  description: string;
  comment: string;
}

interface Report {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  kilometerAllowances: KilometerAllowance[];
  dailyAllowances: DailyAllowance[];
  otherExpenses: OtherExpense[];
}

const OverView: React.FC = () => {
  const [data, setData] = useState<Report | null>(null);
  const [showPdf, setShowPdf] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3005/api/reports/${id}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-y-scroll colored-page">
    
      <div className="w-full lg:w-[15%] overflow-y-scroll p-4">
        <div className="mt-16 space-y-8">
          {data.otherExpenses.map((expense, index) =>
            expense.attachments && expense.attachments.length > 0 ? (
              <>
                {expense.attachments.map((attachment) => (
                  <div key={attachment.fileName} className="bg-gray-600 h-60">
                    {attachment.url.includes(".pdf") ? (
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <p className="py-2 text-center">{attachment.fileName}</p>
                        <div className="flex items-center justify-center w-full h-48">
                          <FaFilePdf className="w-1/2 h-1/2" />
                        </div>
                      </a>
                    ) : (
                      <img
                        src={attachment.url}
                        alt="attachment image"
                        className="w-full h-full"
                      />
                    )}
                  </div>
                ))}
              </>
            ) : null
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="colored-window w-full lg:w-[60%] max-h-[120%] overflow-y-auto p-4 bg-white rounded-md">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h1 className="text-xl lg:text-3xl font-bold">Overview</h1>
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 border border-gray-400 rounded-md dark:text-gray-800 text-xs lg:text-base">
              <option>{data.title}</option>
            </select>
            <PdfGenerator data={data} />
            <Link to="/reports">
              <button className="px-2 py-1 lg:px-4 lg:py-2 text-white bg-blue-500 rounded-lg text-xs lg:text-base">
                Back to Reports
              </button>
            </Link>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-4 lg:p-6 border-2 border-gray-800 rounded-lg text-xs lg:text-base">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <h2 className="font-semibold text-lg lg:text-2xl">{data.title}</h2>
            <button className="flex items-center gap-2 px-2 py-1 lg:px-4 lg:py-2 border border-gray-400 rounded-lg text-xs lg:text-base">
              <span>&#9998;</span>Edit
            </button>
          </div>

          <hr className="my-4 border-gray-light-400 dark:border-blue-dark-800" />

          <div className="mb-8 space-y-4 lg:space-y-6">
            <h3 className="font-semibold text-lg lg:text-md">Explanation of the trip:</h3>
            <p>{data.description}</p>
          </div>

          {/* Trip Dates */}
          <div className="mb-4 text-lg">
            <p className="font-semibold">Trip Dates</p>
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(data.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(data.endDate).toLocaleDateString()}
            </p>
          </div>

          <hr className="my-4 border-gray-light-400 dark:border-blue-dark-800" />
{/* Kilometer Allowances */}
          <div className="mb-6 text-lg">
            <p className="font-semibold">Kilometer Allowances</p>
            {data.kilometerAllowances.map((allowance) => (
              <div key={allowance.id} className="mb-4">
                <p>
                  <strong>Start Point :</strong>  <span>&nbsp;&nbsp;</span>{allowance.startPoint}
                </p>
                <p>
                  <strong>End Point :</strong>  <span>&nbsp;&nbsp;</span>{allowance.endPoint}
                </p>
                <p>
                  <strong>Description: <span>&nbsp;&nbsp;</span>{allowance.description}</strong>
                </p>
                <p>
                  <strong>Vehicle:</strong>  <span>&nbsp;&nbsp;</span>{allowance.vehicleInfo}
                </p>
                <p>
                  <strong>Distance:</strong> <span>&nbsp;&nbsp;</span> {allowance.distance} km
                </p>
                
                <p>
                  <strong>Start Date:</strong>
                   <span>&nbsp;&nbsp;</span> {/* Adding space between label and date */}
                    {new Date(allowance.startDate).toLocaleDateString()}
                    <span>&nbsp;&nbsp;</span> {/* Adding space between date and time */}
                    <span>{new Date(allowance.startDate).toLocaleTimeString()}</span>
                    </p>
                 <p>
                    <strong>End Date:</strong>
                    <span>&nbsp;&nbsp;</span> {/* Adding space between label and date */}
                    {new Date(allowance.endDate).toLocaleDateString()}
                    <span>&nbsp;&nbsp;</span> {/* Adding space between date and time */}
                    <span>{new Date(allowance.endDate).toLocaleTimeString()}</span>
                    </p>
                     <p>
                  <strong>Passengers:</strong> {allowance.passengers} (Names:{" "}
                  {allowance.passengerNames.join(", ")})
                </p>
                <p>
                  <strong>Total Cost:</strong>  <span>&nbsp;&nbsp;</span>{allowance.totalCost} Euro
                </p>
              </div>
            ))}
          </div>

          <hr className="my-4 border-gray-light-400 dark:border-blue-dark-800" />

          {/* Daily Allowances */}
          <div className="mb-6 text-lg">
            <p className="font-semibold">Daily Allowances</p>
            {data.dailyAllowances.map((allowance) => (
              <div key={allowance.id} className="mb-4">
                <p>
                  <strong>start date time:</strong>{allowance.startDateTime}
                </p>
                <p>
                  <strong>end date time:</strong> {allowance.endDateTime}
                </p>
                <p>
                  <strong>Trval by plane or ship :</strong> {allowance.travelByPlaneShip}
                </p>
                <p>
                  <strong>Destination:</strong> {allowance.destination}
                </p>
                <p>
                  <strong>less than five killometer:</strong>{" "} {allowance.lessFivekm ? "Yes" :"No"}
                </p>

                <p>
                  <strong>Travel by Ship or Plane:</strong>{" "}
                  {allowance.travelingByShipOrPlane ? "Yes" : "No"}
                </p>
              </div>
            ))}
          </div>

          <hr className="my-4 border-gray-light-400 dark:border-blue-dark-800" />

          {/* Other Expenses */}
          <div className="mb-6 text-lg">
            <p className="font-semibold">Other Expenses</p>
            {data.otherExpenses.map((expense) => (
              <div key={expense.id} className="mb-4">
                <p>
                  <strong>Type:</strong> {expense.type}
                </p>
                <p>
                  <strong>Amount:</strong> {expense.amount} €
                </p>
                <p>
                  <strong>Description:</strong> {expense.description}
                </p>
                <p>
                  <strong>Comment:</strong> {expense.comment}
                </p>
              </div>
            ))}
          </div>
          

          <div className="flex items-center justify-between">
            <p>
              <strong>Total Expenses:</strong> 1170 €
            </p>
          </div>
         
          <div className="mt-4 text-sm text-gray-800/80 dark:text-gray-200/80">
            <p>
              * This report contains{" "}
              {data.kilometerAllowances.length +
                data.dailyAllowances.length +
                data.otherExpenses.length}{" "}
              items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverView;


  