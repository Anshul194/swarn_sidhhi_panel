import React from 'react'
import { useNavigate } from "react-router-dom";

const PersonalDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 xl:px-10 xl:py-12 mx-auto">
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-center mb-6">
        Personal Year Details
      </h1>

      {/* Details Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Details</h3>
        <div>
          <div className="flex items-center space-x-2 mb-5">
            <label className="font-medium w-32">Title English:</label>
            <input
              type="text"
              placeholder="Enter Title in English"
              className="flex-1 border rounded px-3 py-2"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="font-medium w-32">Title Hindi:</label>
            <input
              type="text"
              placeholder="Enter Title in Hindi"
              className="flex-1 border rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Meaning Sections */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Present Meaning (English) */}
        <div className="border rounded-lg p-5">
          <h2 className="font-semibold mb-2">Present Meaning (English)</h2>
          <textarea
            rows={6}
            placeholder="Enter present meaning in English"
            className="w-full border rounded px-3 py-2"
          ></textarea>
        </div>
        {/* Present Meaning (Hindi) */}
        <div className="border rounded-lg p-5">
          <h2 className="font-semibold mb-2">Present Meaning (Hindi)</h2>
          <textarea
            rows={6}
            placeholder="Enter present meaning in Hindi"
            className="w-full border rounded px-3 py-2"
          ></textarea>
        </div>
        {/* Missing Meaning (English) */}
        <div className="border rounded-lg p-5">
          <h2 className="font-semibold mb-2">Missing Meaning (English)</h2>
          <textarea
            rows={6}
            placeholder="Enter missing meaning in English"
            className="w-full border rounded px-3 py-2"
          ></textarea>
        </div>
        {/* Missing Meaning (Hindi) */}
        <div className="border rounded-lg p-5">
          <h2 className="font-semibold mb-2">Missing Meaning (Hindi)</h2>
          <textarea
            rows={6}
            placeholder="Enter missing meaning in Hindi"
            className="w-full border rounded px-3 py-2"
          ></textarea>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 text-right">
        <button
          className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default PersonalDetails
