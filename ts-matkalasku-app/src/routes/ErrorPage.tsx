import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/home');
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1565130838609-c3a86655db61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNzMwN3wwfDF8c2VhcmNofDV8fG5pZ2h0JTIwc2t5fGVufDB8fHx8MTY5MjYyNTI0NA&ixlib=rb-1.2.1&q=80&w=1080')`,
      }}
    >
      <div className="bg-black bg-opacity-50 p-8 rounded-md text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Error (404)</h1>
        <p className="text-white text-xl mb-6">Something went wrong :(</p>
        <button
          onClick={handleHomeClick}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white rounded-md text-lg"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
