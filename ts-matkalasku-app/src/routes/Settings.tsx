import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
//import { useAuth0 } from "@auth0/auth0-react";
import Modal from "@/components/Modal";

interface Location {
  id: number;
  name: string;
  country: string;
  coordinates: string;
  address: string;
}

const Settings: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const { logout, user } = useAuth0();
  console.log(user);

  const navigate = useNavigate();

  const addLocation = () => {
    const newLocation: Location = {
      id: Date.now(),
      name: "",
      country: "",
      coordinates: "",
      address: "",
    };
    setLocations([...locations, newLocation]);
  };

  const updateLocation = (id: number, field: keyof Location, value: string) => {
    const updatedLocations = locations.map((location) =>
      location.id === id ? { ...location, [field]: value } : location,
    );
    setLocations(updatedLocations);
  };

  const deleteLocation = (id: number) => {
    setLocations(locations.filter((location) => location.id !== id));
  };

  const handleLogout = () => {
    logout(); // Call logout without `returnTo`
    navigate("/"); // Navigate to a route after logout
  };

  //const { isAuthenticated } = useAuth0();

  // Checking if the user is logged in. If not, the user will be directed to the welcome page
  //if (isAuthenticated == false){
  //navigate("/");
  //}

  const [isModalDelete, setIsModalDelete] = useState<Boolean>(false);

  const handelCloseDelete = () => {
    setIsModalDelete(false);
  };
  const handelOpenDelete = () => {
    setIsModalDelete(true);
  };

  return (
    <div className="colored-window min-h-screen p-6">
      <h1 className="mb-6 text-left text-2xl font-bold">Default Settings</h1>

      {/* Settings Form */}
      <div className="w-full max-w-lg text-left">
        <div className="mb-4 flex space-x-6">
          {/* Language Dropdown */}
          <div className="w-1/2">
            <label className="mb-2 block font-semibold">Language</label>
            <select className="w-full rounded border border-gray-800 bg-white p-2 dark:text-gray-800">
              <option>Current (English)</option>
              <option>Finnish</option>
            </select>
          </div>

          {/* Currency Dropdown */}
          <div className="w-1/2">
            <label className="mb-2 block font-semibold">Currency</label>
            <select className="w-full rounded border border-gray-800 bg-white p-2 dark:text-gray-800">
              <option>EUR (€)</option>
              <option>USD ($)</option>
              <option>Zimbabwean dollar (Z$)</option>
            </select>
          </div>
        </div>

        {/* Date Format Dropdown */}
        <div className="w-1/2">
          <label className="mb-2 block font-semibold">Date Format</label>
          <select className="w-full rounded border border-gray-800 bg-white p-2 dark:text-gray-800">
            <option>DD/MM/YYYY</option>
            <option>MM/DD/YYYY</option>
            <option>YYYY/DD/MM</option>
          </select>
        </div>
      </div>

      {/* Default Locations */}
      <div className="mb-6 mt-8">
        <h2 className="mb-4 text-xl font-bold">Default Locations</h2>
        {locations.map((location, index) => (
          <div key={location.id} className="mb-6">
            <div className="mb-2 flex items-center space-x-4">
              {/* Show labels only for the first location */}
              {index === 0 && (
                <>
                  <div className="w-1/5">
                    <label className="mb-1 block">Name</label>
                  </div>
                  <div className="w-1/5">
                    <label className="mb-1 block">Country</label>
                  </div>
                  <div className="w-1/3">
                    <label className="mb-1 block">Coordinates</label>
                  </div>
                  <div className="w-1/3">
                    <label className="mb-1 block">Address</label>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-1/5">
                <select
                  className="w-full rounded border border-gray-800 bg-white p-2 dark:text-gray-800"
                  value={location.name}
                  onChange={(e) =>
                    updateLocation(location.id, "name", e.target.value)
                  }
                >
                  <option value="">name</option>
                  <option>New York</option>
                  <option>Helsinki</option>
                  <option>Tokyo</option>
                </select>
              </div>

              <div className="w-1/5">
                <select
                  className="w-full rounded border border-gray-800 bg-white p-2 dark:text-gray-800"
                  value={location.country}
                  onChange={(e) =>
                    updateLocation(location.id, "country", e.target.value)
                  }
                >
                  <option value="">country</option>
                  <option>USA</option>
                  <option>Finland</option>
                  <option>Japan</option>
                </select>
              </div>

              <div className="w-1/3">
                <input
                  type="text"
                  placeholder="coordinates"
                  className="w-full rounded border border-gray-800 bg-white p-2 dark:text-gray-800"
                  value={location.coordinates}
                  onChange={(e) =>
                    updateLocation(location.id, "coordinates", e.target.value)
                  }
                />
              </div>

              <div className="w-1/3">
                <input
                  type="text"
                  placeholder="address"
                  className="w-full rounded border border-gray-800 bg-white p-2 dark:text-gray-800"
                  value={location.address}
                  onChange={(e) =>
                    updateLocation(location.id, "address", e.target.value)
                  }
                />
              </div>

              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => deleteLocation(location.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
        <button
          className="rounded bg-emerald-600 p-2 font-medium text-gray-light-100"
          onClick={addLocation}
        >
          Add Location
        </button>
      </div>

      {/* Login Information */}
      <div className="mb-6">
        <h2 className="mb-4 text-xl font-bold">Login Information</h2>

        {/* Name of User */}
        <div className="mb-4">
          <label className="block font-semibold">Name of user:</label>

          {user && <p className="ml-4">{user.nickname}</p>}
        </div>

        {/* Email */}
        <div className="mb-6 flex items-center">
          <div className="flex-1">
            <label className="block font-semibold">Email:</label>
            <p className="ml-4">{user == null ? "user" : user.name}</p>
          </div>
          <button className="ml-2 text-gray-400 hover:text-white">
            <FaEdit className="text-gray-800 dark:text-blue-dark-300" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button className="rounded bg-cyan-light-300 p-2 font-medium dark:bg-blue-dark-800 dark:text-gray-200">
          Change password
        </button>
        <button
          className="rounded bg-gray-200 p-2 font-medium text-red-700 outline outline-red-800 dark:bg-red-900 dark:text-gray-200 dark:outline-none"
          onClick={handelOpenDelete}
        >
          Delete Account
        </button>
        {isModalDelete && (
          <Modal onClose={handelCloseDelete}>
            <div className="flex flex-col items-center justify-center space-y-6 p-4">
              <h2 className="mt-5 text-center text-lg font-bold dark:text-white">
                You are about to delete your account. Are you sure you want to
                proceed?
              </h2>
              <button className="rounded-md bg-red-500 p-2 px-6 py-3 text-white dark:bg-red-900">
                Continue
              </button>
            </div>
          </Modal>
        )}
        <button
          className="rounded bg-red-700 p-2 text-white"
          //onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Settings;
