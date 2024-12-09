import { useEffect, useState } from "react";
import KeenSlider, { KeenSliderInstance } from "keen-slider";
import "keen-slider/keen-slider.min.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

// Define the Report interface
interface Report {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface CarouselProps {
  reports: Report[]; // Type the reports prop
}

const Carousel = ({ reports }: CarouselProps) => {
  const [keenSliderInstance, setKeenSliderInstance] =
    useState<KeenSliderInstance | null>(null);

  useEffect(() => {
    const keenSlider = new KeenSlider("#keen-slider", {
      loop: true,
      slides: {
        origin: "auto",
        perView: 4,
        spacing: 5,
      },
      breakpoints: {
        "(min-width: 1024px)": {
          slides: {
            origin: "auto",
            perView: 4,
            spacing: 10,
          },
        },
      },
    });

    setKeenSliderInstance(keenSlider);

    // Event listeners for buttons
    const keenSliderPrevious = document.getElementById("keen-slider-previous");
    const keenSliderNext = document.getElementById("keen-slider-next");

    if (keenSliderPrevious && keenSliderNext) {
      keenSliderPrevious.addEventListener("click", () => keenSlider.prev());
      keenSliderNext.addEventListener("click", () => keenSlider.next());
    }

    // Clean up event listeners when component unmounts
    return () => {
      keenSlider.destroy();
      if (keenSliderPrevious && keenSliderNext) {
        keenSliderPrevious.removeEventListener("click", keenSlider.prev);
        keenSliderNext.removeEventListener("click", keenSlider.next);
      }
    };
  }, []);

  return (
    <section className="colored-window dark:bg-blue-dark-950">
      <div className="mx-auto max-w-[1340px] bg-gray-light-100 px-4 py-4 dark:bg-blue-dark-950">
        <div className="text-center">
          <h2 className="px-6 py-3 text-2xl font-bold">Recent Trips</h2>
        </div>

        {/* Carousel container */}
        <div className="relative flex items-center">
          <div id="keen-slider" className="keen-slider mx-16 mt-8 w-full">
            {/* Map through reports to create slides */}
            {reports && reports.length > 0 ? (
              reports.map((report: Report) => (
                <div key={report.id} className="keen-slider__slide">
                  <Link to={`/overview/${report.id}`}>
                    <blockquote className="flex flex-col justify-between bg-cyan-light-300 p-4 hover:bg-cyan-light-600 hover:text-gray-200 dark:bg-blue-dark-800 dark:hover:bg-blue-dark-300 dark:hover:text-gray-800 sm:h-40 sm:p-6">
                      <div>
                        <div className="flex gap-0.5">
                          <p>
                            {new Date(report.startDate).toLocaleDateString()} -
                            {new Date(report.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-4">
                          <p className="text-lg font-bold">{report.title}</p>
                          <p className="mt-4 leading-relaxed">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </blockquote>
                  </Link>
                </div>
              ))
            ) : (
              <p>No reports available</p>
            )}
          </div>

          {reports && reports.length > 4 && (
            <div>
              <button
                aria-label="Previous slide"
                id="keen-slider-previous"
                className="button-neutral absolute left-1 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full p-3"
              >
                <FaChevronLeft className="text-xl" />
              </button>
              <button
                aria-label="Next slide"
                id="keen-slider-next"
                className="button-neutral absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 transform rounded-full p-3"
              >
                <FaChevronRight className="text-xl" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
