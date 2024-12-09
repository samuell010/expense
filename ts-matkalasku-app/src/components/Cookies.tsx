import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState<boolean>(false);

  // Shows the banner, some functionality can be added so the banner appears only once ever.
  useEffect(() => {
      setShowBanner(true);
  }, []);

  // Closes the banner when okay is clicked
  const handleOkay = () => {
    setShowBanner(false);
  };

  // If user closes the banner it wont reappear suddenly.
  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white text-center py-4 px-6 z-50">
      {/* this text can be and probably should be changed, its just a placeholder for me. */}
      <p className="mb-4">Auth0 uses cookies to keep you logged in, you can disable the cookies but you'll have to login everytime.</p>
      <div className="space-x-4">
        <button
          onClick={handleOkay}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Okay
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
