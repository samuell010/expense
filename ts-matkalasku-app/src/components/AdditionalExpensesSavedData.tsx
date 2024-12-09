import React from "react";
import { AdditionalExpensesEntry } from "@/Types";

interface AdditionalExpensesSavedDataProps {
  data: AdditionalExpensesEntry;
}

const AdditionalExpensesSavedData: React.FC<
  AdditionalExpensesSavedDataProps
> = ({ data }) => {
  return (
    <tr
      className="focus:outline-none focus:ring focus:ring-blue-dark-300"
      tabIndex={0}
    >
      <td className="px-4 py-2">{data.type}</td>
      <td className="px-4 py-2">{data.date}</td>
      <td className="px-4 py-2">{data.country}</td>
      <td className="px-4 py-2">
        {data.amount} <p>(VAT included)</p>
      </td>
      <td className="px-4 py-2">{data.description}</td>
      <td className="px-4 py-2">{data.attachments}</td>
    </tr>
  );
};

export default AdditionalExpensesSavedData;
