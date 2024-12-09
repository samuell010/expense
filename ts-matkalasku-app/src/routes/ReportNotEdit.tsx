// import React, { useState } from "react";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
// import DailyAllowance from "@/components/DailyAllowance";
// import KilometerAllowance from "@/components/KilometerAllowance";
// import AdditionalExpenses from "@/components/AdditionalExpenses";
// import { useNavigate } from "react-router-dom";
//import { useAuth0 } from "@auth0/auth0-react";

// const ReportEditing: React.FC = () => {
//   const [showKilometerAllowance, setShowKilometerAllowance] = useState(false);
//   const [showDailyAllowance, setShowDailyAllowance] = useState(false);
//   const [showAdditionalAllowance, setShowAdditionalAllowance] = useState(false);

//   const navigate = useNavigate();
 
  //const { isAuthenticated } = useAuth0();

  // Checking if the user is logged in. If not, the user will be directed to the welcome page
  //if (isAuthenticated == false){
    //navigate("/");
  //}

//   return (
//     <>
//       <div className="min-h-screen bg-blue-dark-900 font-openSansBody text-white">
//         {/* Placeholder for text and icons */}
//         <div className="relative flex justify-between p-4">
//           <div className="flex-1 border border-white p-7">
//             <h2 className="mb-2 text-center font-robotoTitle text-xl">
//               Placeholder for a very long title to see that it doesn’t overlap
//               with other elements in this box
//             </h2>
//             <p>
//               Placeholder text representing a very long description. Lorem ipsum
//               dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
//               incididunt ut labore et dolore magna aliqua. Ut enim ad minim
//               veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
//               ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
//               voluptate velit esse cillum dolore eu fugiat nulla pariatur.
//             </p>
//           </div>

          
//           <span className="absolute inset-x-0 bottom-1 h-0.5 bg-white"></span>
//         </div>

//         {/* Buttons for adding components */}
//         <div className="flex flex-col p-6">
//           {/* Daily Allowance buttons */}
//           <div className="p-3">
//             {/* Arrow icon that rotates */}
//             <button onClick={() => setShowDailyAllowance(!showDailyAllowance)}>
//               <span>
//                 <KeyboardDoubleArrowUpIcon
//                   className={`transition-transform duration-500 ${showDailyAllowance ? "rotate-180" : "rotate-0"}`}
//                 />
//                 Daily Allowance / Per Diem
//               </span>
//             </button>

//             <button
//               className="m-4 rounded-lg bg-emerald-500 px-5 py-2"
//               onClick={() => setShowDailyAllowance(!showDailyAllowance)}
//             >
//               <span>
//                 <AddCircleOutlineIcon /> Add
//               </span>
//             </button>

//             {/* Collapsible Content */}
//             {showDailyAllowance && (
//               <div className="overflow-hidden transition-all duration-500">
//                 <DailyAllowance />
//               </div>
//             )}
//           </div>

//           {/* Kilometer Allowance buttons */}
//           <div className="p-3">
//             {/* Arrow icon that rotates */}
//             <button
//               onClick={() => setShowKilometerAllowance(!showKilometerAllowance)}
//             >
//               <span>
//                 <KeyboardDoubleArrowUpIcon
//                   className={`transition-transform duration-500 ${showKilometerAllowance ? "rotate-180" : "rotate-0"}`}
//                 />{" "}
//                 Kilometer Allowances
//               </span>
//             </button>

//             <button
//               className="m-4 rounded-lg bg-emerald-500 px-5 py-2"
//               onClick={() => setShowKilometerAllowance(!showKilometerAllowance)}
//             >
//               <span>
//                 <AddCircleOutlineIcon /> Add
//               </span>
//             </button>

//             {/* Collapsible Content */}
//             {showKilometerAllowance && (
//               <div className="overflow-hidden transition-all duration-500">
//                 <KilometerAllowance />
//               </div>
//             )}
//           </div>

//           {/* Additional Expenses buttons */}
//           <div className="p-3">
//             {/* Arrow icon that rotates */}
//             <button
//               onClick={() =>
//                 setShowAdditionalAllowance(!showAdditionalAllowance)
//               }
//             >
//               <span>
//                 <KeyboardDoubleArrowUpIcon
//                   className={`transition-transform duration-500 ${
//                     showAdditionalAllowance ? "rotate-180" : "rotate-0"
//                   }`}
//                 />{" "}
//                 Additional Expenses
//               </span>
//             </button>

//             <button
//               className="m-4 rounded-lg bg-emerald-500 px-5 py-2"
//               onClick={() =>
//                 setShowAdditionalAllowance(!showAdditionalAllowance)
//               }
//             >
//               <span>
//                 <AddCircleOutlineIcon /> Add
//               </span>
//             </button>

//             {/* Collapsible Content */}
//             {showAdditionalAllowance && (
//               <div className="overflow-hidden transition-all duration-500">
//                 <AdditionalExpenses />
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="mb-20 flex justify-center">
//           <button className="button m-6"
//           onClick={() => navigate("/reportnotedit")}>Save as ready</button>
//           {/* <button className="button m-6">Save as Draft</button> */}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ReportEditing;

import React from 'react'

const ReportNotEdit = () => {
  return (
    <div>
      
    </div>
  )
}

export default ReportNotEdit
