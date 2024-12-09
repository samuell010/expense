const config = {
  // The ! after process.env.REACT_APP_API_KEY tells TypeScript that you are sure this value exists and won't be null or undefined.
  apiKey: import.meta.env.VITE_API_KEY, // Use import.meta.env for Vite
};

export default config;
