import React, { ChangeEvent, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

const SearchReports: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchQuery(query); // Set the search query from URL search parameters
    }
  }, [searchParams]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value) {
      setSearchParams({ query: value });
    } else {
      // Delete the query parameter if the input is empty
      searchParams.delete("query");
      setSearchParams(searchParams);
    }

    // console.log(value);
  };

  // console.log(searchQuery);

  return (
    <>
      <div className="rtl:inset-r-0 pointer-events-none absolute inset-y-0 left-0 flex items-center ps-3 rtl:right-0">
        <FaSearch className="dark:text-white" />
      </div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleChange}
        className="block w-72 rounded-lg border border-gray-400 bg-gray-light-100 p-2 ps-10 text-sm text-gray-800 focus:border-cyan-light-600 focus:ring-cyan-light-600 dark:border-blue-dark-800 dark:bg-blue-dark-900 dark:text-gray-200 dark:placeholder-blue-dark-300 dark:focus:border-blue-dark-800 dark:focus:ring-blue-dark-800"
      />
    </>
  );
};

export default SearchReports;
