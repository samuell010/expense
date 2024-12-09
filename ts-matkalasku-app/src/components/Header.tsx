import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { ModeToggle } from "./Mode-toggle";
import logo from "../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import GreetPerson from "./greetAccountName";
import Modal from "@/components/Modal";
const LandingPage: React.FC = () => {
  const [isModal, setIsModal] = useState<Boolean>(false);

  const handelClose = () => {
    setIsModal(false);
  };
  const handelOpen = () => {
    setIsModal(true);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth0();
  const { pathname } = useLocation();
  if (
    /* pathname === "/welcome" || */
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup"
  )
    return null;

  return (
    <header className="border-b-2 border-gray-500 bg-gray-light-400 text-gray-800 dark:bg-blue-dark-950 dark:text-gray-200">
      <nav
        className="mx-auto flex max-w-screen-2xl items-center justify-between p-6 lg:px-9"
        aria-label="Global"
      >
        {/* Logo & Title
        A flex container that holds the logo and the title. It uses gap-3 for spacing between items and items-center to vertically align them.
        Home icon removed for the time being, link now in logo + title*/}
        <div className="flex items-center gap-3 lg:flex-1">
          <button
            onClick={() => navigate("/home")}
            className="-m-1.5 flex gap-3 p-1.5"
          >
            <img className="w-auto" src={logo} alt="MatkaLasku logo" />
            <div className="self-center text-2xl">MatkaLasku</div>
          </button>

          {/* <a href="">
            <HomeIcon className="h-8 w-8" onClick={() => navigate("/home")} />
          </a> */}
        </div>
        {/* Mobile Menu Button
        A flex container for the button, hidden on small screens and above using sm:hidden */}
        <div className="flex space-x-4 sm:hidden">
          <ModeToggle />
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            {/* Hamburger */}
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        {/* Desktop Navigation Links
        This container holds navigation links and is visible only on small screens and above (sm:flex) */}
        <div className="hidden items-center gap-8 sm:flex sm:flex-1 sm:justify-end">
          <ModeToggle />
          {/* Extra menu for developers for quick site navigation, comment out if using in practice */}
          <Menu>
            <MenuButton className="flex cursor-pointer gap-2 p-2 text-lg leading-6">
              <a>Dev menu</a>
              <ArrowDropDownIcon />
            </MenuButton>
            <MenuItems
              anchor="bottom"
              className="flex flex-col rounded border border-b-4 border-gray-600 bg-gray-light-100 [--anchor-gap:1.0rem] dark:bg-blue-dark-950 dark:text-gray-200"
            >
              <MenuItem>
                <a
                  className="cursor-pointer p-4 text-lg font-semibold hover:bg-cyan-light-300 dark:hover:bg-blue-dark-300 dark:hover:text-gray-800"
                  onClick={() => navigate("/home")}
                >
                  Home
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  className="cursor-pointer p-4 text-lg font-semibold hover:bg-cyan-light-300 dark:hover:bg-blue-dark-300 dark:hover:text-gray-800"
                  onClick={() => navigate("/reports")}
                >
                  Report list
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  className="cursor-pointer p-4 text-lg font-semibold hover:bg-cyan-light-300 dark:hover:bg-blue-dark-300 dark:hover:text-gray-800"
                  onClick={() => navigate("/reportedit")}
                >
                  Report editing
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  className="cursor-pointer p-4 text-lg font-semibold hover:bg-cyan-light-300 dark:hover:bg-blue-dark-300 dark:hover:text-gray-800"
                  onClick={() => navigate("/newtrip")}
                >
                  New trip page
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  className="cursor-pointer p-4 text-lg font-semibold hover:bg-cyan-light-300 dark:hover:bg-blue-dark-300 dark:hover:text-gray-800"
                  onClick={() => navigate("/settings")}
                >
                  Settings
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  className="cursor-pointer bg-red-600/75 p-4 text-lg font-semibold text-gray-200 hover:bg-red-800"
                  onClick={() => logout()}
                >
                  Log Out
                </a>
              </MenuItem>
            </MenuItems>
          </Menu>
          {/* End of developer menu */}
          {/* Dropdown menu with links to user settings and a log out option */}
          <Menu>
            <MenuButton className="flex cursor-pointer gap-2 p-2 text-lg font-semibold leading-6">
              <UserIcon className="solid h-6 w-6" aria-hidden="true" />
              <GreetPerson />
              <ArrowDropDownIcon />
            </MenuButton>
            <MenuItems
              anchor="bottom"
              className="flex flex-col rounded border border-b-4 border-gray-600 bg-gray-light-100 [--anchor-gap:1.0rem] dark:bg-blue-dark-950 dark:text-gray-200"
            >
              <MenuItem>
                <a
                  className="cursor-pointer p-4 text-lg font-semibold hover:bg-cyan-light-300 dark:hover:bg-blue-dark-300 dark:hover:text-gray-800"
                  onClick={() => navigate("/setting")}
                >
                  User Settings
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  className="cursor-pointer bg-red-600/75 p-4 text-lg font-semibold text-gray-200 hover:bg-red-800"
                  onClick={() => logout()}
                >
                  Log Out
                </a>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </nav>
      {/* Mobile Menu Dialog 
      A component from Headless UI that creates a modal dialog*/}
      <Dialog
        // hidden in large screens (lg)
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        {/* Overlay: Acts as a background overlay that covers the page behind the dialog, giving it a modal effect. */}
        <div className="fixed inset-0 z-10" />
        {/* A styled panel for the mobile menu */}
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-light-100 px-6 py-6 text-gray-800 dark:bg-blue-dark-900 dark:text-gray-200 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          {/* Mobile Menu Content */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5">
                <img className="h-8 w-auto" src={logo} alt="" />
              </a>
              <div className="text-2xl">MatkaLasku</div>
            </div>
            {/* Close Button */}
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              {/* A close (X) icon */}
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-800/50 dark:divide-gray-200">
              <div className="space-y-2 py-6">
                <a
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-blue-dark-800 dark:hover:text-white"
                  onClick={() => {
                    navigate("/reports");
                    setMobileMenuOpen(false); // Close the menu after navigation
                  }}
                >
                  Reports
                </a>
                <a
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-blue-dark-800 dark:hover:text-white"
                  onClick={() => {
                    navigate("/settings");
                    setMobileMenuOpen(false); // Close the menu after navigation
                  }}
                >
                  Settings
                </a>
              </div>
              <div className="py-6">
                <a
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-blue-dark-800 dark:hover:text-white"
                  //onClick={() => logout()}
                  onClick={handelOpen}
                >
                  Log Out
                </a>
                {isModal && (
                  <Modal onClose={handelClose}>
                    <div className="flex flex-col items-center justify-center space-y-12 p-4 dark:bg-blue-dark-900 dark:text-gray-200">
                      <h2 className="mt-3 text-center text-lg font-bold">
                        You are about to log out. Do you want to continue?
                      </h2>
                      <button
                        className="rounded-md bg-red-500 px-6 py-3 text-white dark:bg-red-900"
                        onClick={() => logout()}
                      >
                        Continue
                      </button>
                    </div>
                  </Modal>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default LandingPage;
