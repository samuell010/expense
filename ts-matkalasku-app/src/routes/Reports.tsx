import React, { useEffect, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
/* import { FaSearch } from "react-icons/fa"; */
import SortIcon from "../components/ui/SortIcon"; // Import your custom SortIcon component
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
// import SearchReports from "@/components/SearchReports";
import { useDebounce } from "use-debounce";
import SearchReports from "@/components/SearchReports";
import PaginationBar from "@/components/PaginationBar";
//import { useAuth0 } from "@auth0/auth0-react";

// import SearchBox from "@/components/SearchBox";

// The main ProductTable component
const ProductTable: React.FC = () => {
  // Number of items to display per page
  const itemsPerPage = 5;

  interface Report {
    id: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
  }

  function parsePageParam(paramValue: string): number {
    if (paramValue) {
      const page = parseInt(paramValue);
      if (isFinite(page) && page > 0) {
        return page;
      }
    }
    return 1;
  }

  // State to keep track of the current page
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState<Report[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [selectedView, setSelectedView] = useState<string>("Reports");
  const [searchParams] = useSearchParams();

  const page = parsePageParam(searchParams.get("page") || "");

  // console.log(selectedReports);

  const queryClient = useQueryClient();
  const query = searchParams.get("query") || null;

  // Debounce the query for 500ms
  const [debouncedQuery] = useDebounce<string | null>(query, 1300);

  // // searching reports
  // useEffect(() => {

  //   const searchReports = async () => {
  //     setLoading(true);
  //     try {
  //       const url = "http://localhost:3005/api/reports?page=1&limit=6&description=" + encodeURIComponent(debouncedQuery);
  //       const response = await fetch(url);
  //       const data = await response.json();
  //       setReports(data);
  //     } catch (error) {
  //       console.error('Error fetching reports:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (debouncedQuery) {
  //     searchReports();
  //   } else {
  //     // Clear reports if the search query is empty
  //     setReports([]);
  //   }
  // }, [debouncedQuery]); // Only run the effect when debouncedQuery changes

  // console.log("Here the current: ", reports);

  const handleCheckboxClick = (reportId: number) => {
    setSelectedReports((prevSelected) => {
      if (prevSelected.includes(reportId)) {
        return prevSelected.filter((id) => id !== reportId); // Remove the report if already selected
      } else {
        return [...prevSelected, reportId]; // Add the report to selectedReports
      }
    });
  };

  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedView(event.target.value);
  };

  // function to fetch reports
  const fetchReports = async (
    page: number,
    pageSize: number,
    query: string,
  ) => {
    const baseURL = `http://localhost:3005/api/reports?page=${page}&limit=${pageSize}&isAscending=true`;
    const url = query
      ? `${baseURL}&title=${encodeURIComponent(query)}`
      : baseURL;
    const response = await fetch(url);
    const reports = await response.json();
    return reports;
  };

  // Fetch reports and cache the request
  const { data: initialReports = { reports: [], totalPages: 0 } } = useQuery({
    queryKey: ["reports", page, debouncedQuery],
    queryFn: () => fetchReports(page, 10, debouncedQuery),
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });

  // console.log(initialReports);

  const deleteReports = async (selectedReports: number[]) => {
    const response = await fetch(
      "http://localhost:3005/api/reports/delete-many",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportIds: selectedReports,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  };

  const mutation = useMutation({
    mutationFn: () => deleteReports(selectedReports),
    onSuccess: () => {
      setSelectedReports([]);
      // Invalidate and refetch the reports after deletion
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => {
      console.error("Error deleting reports:", error);
    },
  });

  // const mutation = useMutation({
  //   mutationFn: () => postReport(),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["reports"] })
  //   }
  // })

  // Handle delete action
  const handleDeleteReports = async () => {
    try {
      await mutation.mutateAsync(); // Trigger the mutation
    } catch (error) {
      console.error("Error deleting reports:", error);
    }
  };

  // State to manage sorting configuration
  // 'key' is the column to sort by, and 'direction' is either "ascending" or "descending"
  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof trips)[0]; // The column key to sort by
    direction: string; // Sorting direction: "ascending" or "descending"
  } | null>(null);

  // Function to handle sorting when a column header is clicked
  const onSort = (key: keyof (typeof trips)[0]) => {
    let direction = "ascending";
    // If already sorted by this key in ascending order, switch to descending
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    // Create a sorted copy of the trips array
    const sortedProducts = [...trips].sort((a, b) => {
      let aValue: string | number = a[key];
      let bValue: string | number = b[key];

      // If sorting by 'exemption', which is a currency string, convert it to a number
      if (key === "exemption") {
        aValue = parseFloat(aValue.replace(/[^0-9.-]+/g, "")); // Remove $ and convert to number
        bValue = parseFloat(bValue.replace(/[^0-9.-]+/g, "")); // Remove $ and convert to number
      }

      // Compare the two values based on the current sort direction
      if (aValue < bValue) {
        return direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0; // If the values are equal
    });

    // Update the sorting configuration and the sorted products
    setSortConfig({ key, direction });
    setSortedProducts(sortedProducts);
  };

  // State to store the sorted products list
  const [sortedProducts, setSortedProducts] = useState(trips);

  // Calculate the indices for the items to be shown on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Slice the sorted products array to get only the items for the current page
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages needed to display all products
  const totalPages = Math.ceil(trips.length / itemsPerPage);

  // Function to handle clicking the "Next" button for pagination
  const handleClickNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Function to handle clicking the "Previous" button for pagination
  const handleClickPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Helper function to render the sort icon next to column headers
  const renderSortIcon = (key: keyof (typeof trips)[0]) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <SortIcon />; // Default SortIcon showing both up and down arrows
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUpIcon className="w-4 h-4 text-gray-800 ms-2" />
    ) : (
      <ChevronDownIcon className="w-4 h-4 text-gray-800 ms-2" />
    );
  };

  const navigate = useNavigate();

  //const { isAuthenticated } = useAuth0();

  // Checking if the user is logged in. If not, the user will be directed to the welcome page
  //if (isAuthenticated == false){
  //navigate("/");
  //}

  return (
    <section className="container mx-auto">
      <div className="h-screen rounded-lg colored-window">
        {/* Title area */}
        <div className="p-4 pb-4 border-b-8 border-gray-light-400 dark:border-blue-dark-950">
          <div className="flex items-center justify-between">
            <p className="font-bold">Reports</p>
            <button
              onClick={() => navigate("/newtrip")}
              className="w-1/6 px-4 py-2 button-add"
            >
              + New Business Trip
            </button>
          </div>
        </div>

        {/* Search and filter area */}
        <div className="flex flex-col flex-wrap items-center justify-between p-4 pb-4 space-y-4 sm:flex-row sm:space-y-0 sm:rounded-t-lg">
          <div>
            <select
              value={selectedView}
              className="block w-full px-4 py-3 text-sm font-medium text-gray-800 border border-gray-400 rounded-full bg-cyan-light-50 pe-9 focus:border-cyan-light-300 focus:ring-4 focus:ring-cyan-light-300 dark:border-blue-dark-800 dark:bg-blue-dark-900 dark:text-gray-200 dark:focus:ring-blue-dark-800"
              onChange={handleViewChange}
            >
              <option className="font-bold">Reports</option>
              <option className="font-bold">Drafts</option>
              <option className="font-bold">Completed</option>
              <option className="font-bold">Deleted</option>
            </select>
          </div>

          {/* Search input field */}
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <SearchReports />
          </div>
        </div>
        {/* Table of products */}
        <div className="flex items-center justify-center w-full max-w-screen-lg pb-6 mx-auto">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-xs uppercase bg-cyan-light-300 dark:bg-blue-dark-300 dark:text-gray-800">
              <tr>
                <th scope="col" className="p-2">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-light-400 bg-gray-light-100 text-cyan-light-600 focus:ring-2 focus:ring-cyan-light-600 dark:border-blue-dark-800 dark:bg-blue-dark-900 dark:ring-offset-blue-dark-950 dark:focus:ring-blue-dark-800 dark:focus:ring-offset-blue-dark-950"
                    />
                    <label htmlFor="checkbox-all-search" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </th>
                <th className="px-4 py-2">
                  <div className="flex items-center">
                    Title
                    <a href="#" onClick={() => onSort("description")}>
                      {renderSortIcon("description")}{" "}
                      {/* Render the sort icon for this column */}
                    </a>
                  </div>
                </th>
                <th className="px-4 py-2">
                  <div className="flex items-center">
                    Date
                    <a href="#" onClick={() => onSort("date")}>
                      {renderSortIcon("date")}{" "}
                      {/* Render the sort icon for this column */}
                    </a>
                  </div>
                </th>
                <th className="px-4 py-2">
                  <div className="flex items-center">
                    Exemption
                    <a href="#" onClick={() => onSort("exemption")}>
                      {renderSortIcon("exemption")}{" "}
                      {/* Render the sort icon for this column */}
                    </a>
                  </div>
                </th>
                <th className="px-4 py-2">
                  <div className="flex items-center">
                    Countries
                    <a href="#" onClick={() => onSort("countries")}>
                      {renderSortIcon("countries")}{" "}
                      {/* Render the sort icon for this column */}
                    </a>
                  </div>
                </th>
                <th className="px-4 py-2">
                  <div className="flex items-center"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Map over the current items (only the items on the current page) */}
              {initialReports?.reports.map((report: Report, index: number) => (
                <tr
                  key={index}
                  className="bg-white border-b hover:bg-cyan-100/50 dark:border-blue-dark-800 dark:bg-blue-dark-900 dark:hover:bg-blue-dark-800"
                >
                  <td className="w-4 p-2">
                    <div className="flex items-center">
                      <input
                        id={`checkbox-table-search-${index}`}
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        className="w-4 h-4 rounded border-gray-light-400 bg-gray-light-100 text-cyan-light-600 focus:ring-2 focus:ring-cyan-light-600 dark:border-blue-dark-800 dark:bg-blue-dark-900 dark:ring-offset-blue-dark-950 dark:focus:ring-blue-dark-800 dark:focus:ring-offset-blue-dark-950"
                        onClick={() => handleCheckboxClick(report.id)}
                      />
                      <label
                        htmlFor={`checkbox-table-search-${index}`}
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  <th
                    scope="row"
                    className="px-4 py-2 font-medium text-gray-800 whitespace-nowrap dark:text-gray-200"
                  >
                    {report.title}
                  </th>
                  <td className="px-4 py-2">
                    {new Date(report.startDate).toLocaleDateString()} -{" "}
                    {new Date(report.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">500</td>
                  <td className="px-4 py-2">count</td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/overview/${report.id}`}
                      className="font-medium text-cyan-light-600 hover:underline dark:text-blue-dark-300"
                    >
                      view
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center my-5">
          <PaginationBar
            href="/reports"
            page={page}
            pageCount={initialReports.totalPages}
          />
        </div>
        {/* Pagination controls */}
        {/* <nav className="flex flex-col flex-wrap items-center justify-between p-4 pt-4 bg-gray-light-100 dark:bg-blue-dark-900 sm:rounded-b-lg md:flex-row">
          <span className="text-sm font-normal text-gray-light-900 dark:text-blue-dark-300">
            Showing{" "}
            <span className="font-semibold text-gray-light-900 dark:text-blue-dark-300">
              {indexOfFirstItem + 1}-{indexOfLastItem}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-light-900 dark:text-blue-dark-300">
              {trips.length}
            </span>
          </span>
          <ul className="inline-flex items-center h-8 -space-x-px text-sm">
            <li>
              <button
                onClick={handleClickPrevious}
                disabled={currentPage === 1}
                className="flex items-center justify-center h-8 px-3 leading-tight border ms-0 rounded-s-lg border-gray-light-400 bg-cyan-light-50 text-gray-light-900 hover:bg-cyan-light-300 hover:text-gray-light-900 dark:border-blue-dark-800 dark:bg-blue-dark-900 dark:text-blue-dark-300 dark:hover:bg-blue-dark-950 dark:hover:text-blue-dark-300"
              >
                Previous
              </button>
            </li> */}
        {/* Render pagination buttons */}
        {/* {Array.from({ length: totalPages }, (_, index) => (
              <li key={index}>
                <button
                  onClick={() => setCurrentPage(index + 1)}
                  className={`flex h-8 items-center justify-center px-3 leading-tight ${
                    currentPage === index + 1
                      ? "border border-gray-light-400 bg-cyan-light-300 text-cyan-light-600 hover:bg-cyan-light-300 hover:text-cyan-light-600 dark:border-blue-dark-800 dark:bg-blue-dark-950 dark:text-blue-dark-300"
                      : "border border-gray-light-400 bg-cyan-light-50 text-gray-light-900 hover:bg-cyan-light-300 hover:text-gray-light-900 dark:border-blue-dark-800 dark:bg-blue-dark-900 dark:text-blue-dark-300 dark:hover:bg-blue-dark-950 dark:hover:text-blue-dark-300"
                  }`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={handleClickNext}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center h-8 px-3 leading-tight border rounded-e-lg border-gray-light-400 bg-cyan-light-50 text-gray-light-900 hover:bg-cyan-light-300 hover:text-gray-light-900 dark:border-blue-dark-800 dark:bg-blue-dark-900 dark:text-blue-dark-300 dark:hover:bg-blue-dark-950 dark:hover:text-blue-dark-300"
              >
                Next
              </button>
            </li>
          </ul>
        </nav> */}
        <div className="flex p-4 space-x-4">
          {/* <Button
            size="medium"
            className="text-black dark:bg-blue-dark-300 dark:text-blue-dark-800"
            onClick={() => navigate("/overview")}
          >
            View
          </Button>
          <Button
            variant="secondary"
            size="medium"
            onClick={() => navigate("/delete")}
          >
            Delete
          </Button> */}
          {selectedReports.length > 0 ? (
            <button className="button-delete" onClick={handleDeleteReports}>
              Delete Selected
            </button>
          ) : (
            <button
              className="opacity-50 pointer-events-none button-delete"
              disabled
            >
              Delete Selected
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

// Sample data for the table (array of trip objects)
const trips = [
  {
    description: "Helsinki Finland business trip June",
    date: "01.06.2024 - 07.06.2024",
    exemption: "$2999",
    countries: "Finland",
  },
  {
    description: "London UK conference March",
    date: "15.03.2024 - 22.03.2024",
    exemption: "$1999",
    countries: "UK",
  },
  {
    description: "New York USA client visit May",
    date: "05.05.2024 - 12.05.2024",
    exemption: "$99",
    countries: "USA",
  },
  {
    description: "Paris France exhibition September",
    date: "10.09.2024 - 17.09.2024",
    exemption: "$179",
    countries: "France",
  },
  {
    description: "Tokyo Japan product launch April",
    date: "20.04.2024 - 27.04.2024",
    exemption: "$699",
    countries: "Japan",
  },
  {
    description: "Berlin Germany annual meeting July",
    date: "01.07.2024 - 08.07.2024",
    exemption: "$3999",
    countries: "Germany",
  },
  {
    description: "Sydney Australia seminar November",
    date: "10.11.2024 - 17.11.2024",
    exemption: "$399",
    countries: "Australia",
  },
  {
    description: "Barcelona Spain workshop October",
    date: "05.10.2024 - 12.10.2024",
    exemption: "$99",
    countries: "Spain",
  },
  {
    description: "Dubai UAE sales pitch February",
    date: "20.02.2024 - 27.02.2024",
    exemption: "$79",
    countries: "UAE",
  },
  {
    description: "Singapore Singapore training January",
    date: "01.01.2024 - 08.01.2024",
    exemption: "$29",
    countries: "Singapore",
  },
];

export default ProductTable;
