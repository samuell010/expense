import React from 'react';
import { KilometerAllowanceEntry } from "@/Types"; 

interface KmAllowanceSavedDataProps {
  data: KilometerAllowanceEntry; 
}

const KmAllowanceSavedData: React.FC<KmAllowanceSavedDataProps> = ({ data }) => {
  const unitPrice = 0.5; 

  return (
          <tr className='focus:outline-none focus:ring focus:ring-blue-dark-300' tabIndex={0}>
            <td className="px-4 py-2">{data.vehicleInfo}</td>
            <td className="px-4 py-2">{data.passengers}</td>
            <td className="px-4 py-2">{data.startPoint} - {data.endPoint}</td>
            <td className="px-4 py-2">{data.distance}</td>
            <td className="px-4 py-2">{data.totalCost}</td>
            <td className="px-4 py-2">{unitPrice}</td>
            <td className="px-4 py-2">{data.startDate} - {data.endDate}</td>
            <td className="px-4 py-2">
              <ul>
                {data.passengerNames.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </td>
            <td className="px-4 py-2">{data.description}</td>
          </tr>
  );
};

export default KmAllowanceSavedData;
