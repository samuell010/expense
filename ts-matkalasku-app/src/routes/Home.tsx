import Carousel from "@/components/ui/Carousel";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import GreetPerson from "@/components/greetAccountName";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const navigate = useNavigate();
  /*   const { user, isAuthenticated } = useAuth0();
  // console.log(user, isAuthenticated);
  const auth = useAuth0();
  // console.log(auth);

  // Checking if the user is logged in. If not, the user will be directed to the welcome page
  if (isAuthenticated == false) {
    navigate("/");
  } */
  const [latestDraftId, setLatestDraftId] = useState(null);

  useEffect(() => {
    const fetchLatestDraft = async () => {
      try {
        const response = await fetch(
          "http://localhost:3005/api/reports/latest-draft",
        );
        const data = await response.json();
        if (response.ok) {
          setLatestDraftId(data.id); // Store the draft ID
        } else {
          console.error(
            `Fetching latest report failed with the message: ${data.message}`,
          );
        }
      } catch (error) {
        console.error("Failed to fetch latest draft report:", error);
      }
    };

    fetchLatestDraft();
  }, []);
  // console.log("ID of latest draft:", latestDraftId);

  const handleEditLatestDraft = () => {
    if (latestDraftId) {
      navigate(`/overview/${latestDraftId}`); // Navigate if the ID is available
    } else {
      console.error("No latest draft ID available");
    }
  };

  const fetchReports = async (page: number, pageSize: number) => {
    const url = `http://localhost:3005/api/reports?page=${page}&limit=${pageSize}&isAscending=true`;
    const response = await fetch(url);
    const reports = await response.json();
    return reports;
  };
  const { data: reports, isLoading } = useQuery({
    queryKey: ["front-reports"],
    queryFn: () => fetchReports(1, 10),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return <div>no reports</div>;
  }
  // console.log(reports);

  return (
    <div>
      <div className="colored-window flex min-h-screen flex-col justify-center dark:bg-blue-dark-950">
        <div className="mx-auto w-[65vw]">
          {/* Message text "Hello, user" */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold">
              Hello, <GreetPerson />
            </h2>
          </div>
          {/* Background photo */}
          <div className="container relative overflow-hidden rounded-lg bg-[url('../src/assets/LandingpagePhoto.png')] bg-[length:105%_105%] bg-center bg-no-repeat px-64">
            {/* Dimming effect for the background photo */}
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative p-8 text-center md:p-12 lg:px-16 lg:py-24">
              {/* Add button */}
              <div className="mt-4 sm:mt-8">
                <a href="#">
                  <button
                    onClick={() => navigate("/newtrip")}
                    className="button-add px-6 py-3"
                  >
                    + New Business Trip
                  </button>
                </a>
              </div>
            </div>
          </div>
          {/* Drafts button */}
          <div className="mt-8 flex justify-end">
            {/* <Link to={`/overview/${latestDraftId}`}> */}
            {latestDraftId ? (
              <button
                onClick={handleEditLatestDraft}
                className="button-neutral flex px-4 py-3"
              >
                Edit latest draft <ArrowRightIcon />
              </button>
            ) : (
              <span className="px-4 py-3">(No unfinished drafts)</span>
            )}

            {/* </Link> */}
          </div>
        </div>
        <Carousel reports={reports.reports} />
      </div>
    </div>
  );
};

export default Home;
