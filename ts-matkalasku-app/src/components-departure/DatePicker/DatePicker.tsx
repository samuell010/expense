// import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CustomDatePickerProps {
  label?: string;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  dateFormat?: string;
  isStart?: boolean; 
  timeZone?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  selectedDate,
  onDateChange,
  dateFormat = "yyyy/MM/dd HH:mm", 
  timeZone = "Etc/GMT-3", // Default to GMT+3
}) => {
  // Handle Date change
  const handleDateChange = (date: Date | null) => {
    onDateChange(date);
  };

  // Format the date with time zone
  const formatDateWithTimezone = (date: Date | null) => {
    if (!date) return "";
    const formatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timeZone,
      timeZoneName: "short"
    });
    return formatter.format(date);
  };

  return (
    <div>
      {label && <label>{label}</label>}
      <DatePicker
        className='w-full p-2 rounded-md text-gray-800 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-dark-300'
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat={dateFormat}
        showTimeSelect
        placeholderText="Select date and time"
        timeFormat="HH:mm" // Display time in 24-hour format
        timeIntervals={15} // Interval for time selection
      />
      {/* <div className="mt-2 text-sm text-gray-500">
        {`${formatDateWithTimezone(selectedDate)}`}
      </div> */}
    </div>
  );
};

export default CustomDatePicker;
