import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-indigo-200">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full border-2 border-yellow-400">
        <div className="flex flex-col items-center mb-6">
          <span className="text-4xl font-extrabold text-yellow-600 tracking-wide drop-shadow-md">
            Swarn Sidhhi
          </span>
          <span className="text-lg font-semibold text-indigo-700 mt-1 tracking-widest">
            PANEL
          </span>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-indigo-400 rounded-full mt-3 mb-2" />
        </div>
        <h1 className="text-2xl font-bold text-indigo-700 mb-4 text-center">Dashboard Home</h1>
        <p className="text-gray-600 text-lg text-center">
          Welcome to the Swarn Sidhhi Panel dashboard!
        </p>
      </div>
    </div>
  );
};

export default Home;