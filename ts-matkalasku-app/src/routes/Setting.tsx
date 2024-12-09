import { useState, useEffect } from 'react';
import axios from 'axios';
import i18n from '../i18n'; // Adjust the path as necessary 
import { useAuth0 } from "@auth0/auth0-react";

// Interface for Location
interface Location {
  id: number;
  country: string;
  city: string;
  // latitude: string;
  // longitude: string;
  address: string;
  settingId: string;
}
 
// Interface for Settings
interface Settings {
  userId: string | null;
  currency: string;
  language: string;
  locations: Location[];
  defaultLocation: Location | null;
}
 
const DefaultSettings = () => {
  //TODO fetch the correct settingID from the backend based on user ID
  const [settingId, setSettingId] = useState < number > (14);
  const { user } = useAuth0();
  const [userId, setUserId] = useState<string | null>();
  const [locations, setLocations] = useState < Location[] > ([
    { id: 0, country: '', city: '', address: '' }
  ]);
  const [language, setLanguage] = useState < string > ('en'); // Default language code
  const [currency, setCurrency] = useState < string > ('EUR');
  const [defaultLocationIndex, setDefaultLocationIndex] = useState < number | null > (null);
  const [isSaving, setIsSaving] = useState < boolean > (false);
  const [error, setError] = useState < string | null > (null);
  const [loading, setLoading] = useState < boolean > (true);
 
  console.log({user});

  useEffect(() => {
    if (!user || !user.sub) {
      return;
    }

    // remove the prefix auth0| from the user.sub string
    setUserId(user.sub.replace('auth0|',''))
  }, [user])

  // Fetch settings data from the API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (!userId) {
          return;
        }

        const response = await axios.get(`http://localhost:3005/api/settings/${userId}`);
        if (response.data && response.data.currency && response.data.language && response.data.locations) {
          const { currency, language, locations, defaultLocation } = response.data;
          setCurrency(currency);
          setLanguage(language.toLowerCase());
          setLocations(locations);
          setSettingId(response.data.id)
 
          const defaultIndex = locations.findIndex(
            (location: Location) =>
              location.country === defaultLocation?.country &&
              location.city === defaultLocation?.city &&
              location.address === defaultLocation?.address
          );
          setDefaultLocationIndex(defaultIndex !== -1 ? defaultIndex : null);
        } 
        // else {
        //   throw new Error("Incomplete settings data");
        // }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Failed to load settings.');
      } finally {
        setLoading(false);
      }
    };
 
    fetchSettings();
  }, [userId]);
 
  // Save settings to backend
  const handleSaveSettings = async () => {
    // if (defaultLocationIndex === null) {
    //   setError('Please select a default location before saving.');
    //   return;
    // }
 
    const settingsData: Settings = {
      currency,
      language,
      userId,

      // locations: locations.map((location) => ({
      //   country: location.country,
      //   city: location.city,
      //   latitude: parseFloat(location.latitude),
      //   longitude: parseFloat(location.longitude),
      //   address: location.address,
      //   settingId: location.settingId,
      // })),
      //defaultLocation: locations[defaultLocationIndex],
    };
 
    try {
      setIsSaving(true);
      const response = await axios.post('http://localhost:3005/api/settings', settingsData);
      console.log('Settings saved:', response.data);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
 
 
  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    const languageCode = newLanguage.toLowerCase();
    setLanguage(languageCode);
    i18n.changeLanguage(languageCode);
    localStorage.setItem('i18nextLng', languageCode);
  };
 
  // Add a new location input
  const handleAddLocation = () => {
    setLocations([...locations, { id: locations.length, country: '', city: '',  address: '', settingId: '' }]);
  };
 
  const handleSaveLocation = async (index) => {
    const locationData = locations[index] ?? null
    locationData.settingId = settingId;
 
    try {
      setIsSaving(true);
      const response = await axios.post('http://localhost:3005/api/locations', locationData);
      console.log('locations saved:', response.data);
      alert('locations saved successfully!');
    } catch (error) {
      console.error('Error saving locations:', error);
      setError('Failed to save locations. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  const handleUpdateLocation = async (index: number) => {
    const locationToUpdate = locations[index];

    try {
      setIsSaving(true);
      const response = await axios.put(`http://localhost:3005/api/locations/${locationToUpdate.id}`, {
        country: locationToUpdate.country,
        city: locationToUpdate.city,
        //latitude: parseFloat(locationToUpdate.latitude),
        //longitude: parseFloat(locationToUpdate.longitude),
        address: locationToUpdate.address,
        settingId: locationToUpdate.settingId,
      });

      console.log('Location updated:', response.data);
      alert('Location updated successfully!');
    } catch (error) {
      console.error('Error updating location:', error);
      setError('Failed to update location. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
 
  // Remove a location input
  const handleRemoveLocation = async (index: number) => {
    const locationToRemove = locations[index];
 
    try {
      const response = await axios.delete(`http://localhost:3005/api/locations/${locationToRemove.id}`);
      if (response.status === 200) {
        console.log(`Location with id ${locationToRemove.id} deleted from backend.`);
 
        setLocations((prevLocations) => prevLocations.filter((location) => location.id !== locationToRemove.id));
 
        if (index === defaultLocationIndex) {
          setDefaultLocationIndex(null);
        }
      } else {
        throw new Error("Failed to delete location on backend");
      }
    } catch (error) {
      console.error('Error deleting location from backend:', error);
      setError('Failed to delete location. Please try again.');
    }
  };
 
  if (loading) {
    return <div>Loading settings...</div>;
  }
 
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
 
  return (
    <div className="min-h-screen p-2 bg-blue-dark-900 text-white rounded-lg space-y-6 w-full max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold text-center">{i18n.t("Setting")}</h2>
 
      <div className="flex space-x-6 justify-center">
        <div className="flex flex-col items-center">
          <label htmlFor="language" className="block text-sm">{i18n.t("Language")}</label>
          <select
            id="language"
            className="mt-1 p-2 rounded-md bg-white text-black"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="en">English</option>
            <option value="fi">Finnish</option>
          </select>
        </div>
 
        <div className="flex flex-col items-center">
          <label htmlFor="currency" className="block text-sm">{i18n.t("Currency")}</label>
          <select
            id="currency"
            className="mt-1 p-2 rounded-md bg-white text-black"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="EUR">Euro (€)</option>
            <option value="USD">Dollar ($)</option>
            <option value="GBP">Pound (£)</option>
          </select>
        </div>
      </div>
 
      <div>
        <h3 className="text-lg font-semibold">{i18n.t("Locations")}</h3>
        {locations.map((location, index) => (
          <div key={location.id} className="flex items-center space-x-4 mb-2">
            <input
              type="checkbox"
              checked={defaultLocationIndex === index}
              onChange={() => setDefaultLocationIndex(index)}
            />
            <select
              className="p-2 rounded-md bg-white text-black w-32"
              value={location.country}
              disabled={defaultLocationIndex !== index}
              onChange={(e) => {
                const newLocations = [...locations];
                newLocations[index].country = e.target.value;
                setLocations(newLocations);
              }}
            >
                    <option value="">{i18n.t("Country")}</option>
        <option value="United States">{i18n.t("United States")}</option>
        <option value="Canada">{i18n.t("Canada")}</option>
        <option value="Finland">{i18n.t("Finland")}</option>
        <option value="Spain">{i18n.t("Spain")}</option>
            </select>
 
            <input
              type="text"
              className="p-2 rounded-md bg-white text-black w-32"
              value={location.city}
              disabled={defaultLocationIndex !== index}
              placeholder={i18n.t("City")}
              onChange={(e) => {
                const newLocations = [...locations];
                newLocations[index].city = e.target.value;
                setLocations(newLocations);
              }}
            />
 
            {/* <input
              type="text"
              className="p-2 rounded-md bg-white text-black w-32"
              value={location.latitude}
              disabled={defaultLocationIndex !== index}
              placeholder={i18n.t("Latitude")}
              onChange={(e) => {
                const newLocations = [...locations];
                newLocations[index].latitude = e.target.value;
                setLocations(newLocations);
              }}
            />
 
            <input
              type="text"
              className="p-2 rounded-md bg-white text-black w-32"
              value={location.longitude}
              disabled={defaultLocationIndex !== index}
              placeholder={i18n.t("Longitude")}
              onChange={(e) => {
                const newLocations = [...locations];
                newLocations[index].longitude = e.target.value;
                setLocations(newLocations);
              }}
            /> */}
 
            <input
              type="text"
              className="p-2 rounded-md bg-white text-black w-64"
              value={location.address}
              disabled={defaultLocationIndex !== index}
              placeholder={i18n.t("Address")}
              onChange={(e) => {
                const newLocations = [...locations];
                newLocations[index].address = e.target.value;
                setLocations(newLocations);
              }}
            />
 
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md"
              onClick={() => handleRemoveLocation(index)}
            >
              {i18n.t("Remove")}
            </button>
            {
              !location.settingId ? (<button
                className="bg-green-600 text-white px-4 py-2 rounded-md"
                onClick={() => handleSaveLocation(index)}
              >
                {i18n.t("Add")}
              </button>) : (<button
                className="bg-green-600 text-white px-4 py-2 rounded-md"
                onClick={() => handleUpdateLocation(index)}
              >
                {i18n.t("Update")}
              </button>)
            }
          </div>
        ))}
        <button className="bg-green-600 text-white px-4 py-2 rounded-md mt-12" onClick={handleAddLocation}>
          {i18n.t("Add Location")}
        </button>
      </div>
 
      <button
        className={`px-4 py-2 rounded-md ${isSaving ? 'bg-gray-500' : 'bg-blue-600 text-white'}`}
        onClick={handleSaveSettings}
        disabled={isSaving}
      >
        {isSaving ? i18n.t("Saving...") : i18n.t("Save Settings")}
      </button>
    </div>
  );
};
 
export default DefaultSettings;