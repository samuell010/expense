import { useLocation } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();
  if (
    pathname === "/welcome" ||
    pathname === "/login" ||
    pathname === "/signup"
  )
    return null;

  return (
    <footer className="flex items-center justify-center bg-gray-light-400 py-4 text-black dark:bg-blue-dark-950 dark:text-gray-300">
      <p className="text-center text-sm">
        © 2024 MatkaLasku. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
