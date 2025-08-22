import React from 'react'
import { useLocation } from 'react-router-dom'

const HousesDetails = () => {
  const location = useLocation()
  const houseLabel = location.state?.houseLabel || 'House Details'

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 xl:px-10 xl:py-12 mx-auto">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-center mb-8">{houseLabel}</h1>

      {/* House Section */}
      <h2 className="text-xl font-semibold mb-4">House</h2>
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* House Details (English) */}
        <div className="border rounded-lg p-5">
          <h3 className="font-semibold mb-2">House Details (English)</h3>
          <p>
            <span className="font-bold">Lorem Ipsum</span> is simply dummy text
            of the printing and typesetting industry.
          </p>
          <ul className="list-disc ml-6 my-2">
            <li>
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s, when an unknown printer took a galley
            </li>
            <li>
              of type and scrambled it to make a type specimen book. It has
              survived <br />
              <span className="italic">
                not only five centuries, but also the leap into electronic
              </span>
            </li>
          </ul>
          <p className="font-bold">Lorem Ipsum</p> is simply dummy text of
          the printing
        </div>
        {/* House Details (Hindi) */}
        <div className="border rounded-lg p-5">
          <h3 className="font-semibold mb-2">House Details (Hindi)</h3>
          <p>
            <span className="font-bold">Lorem Ipsum</span> is simply dummy text
            of the printing and typesetting industry.
          </p>
          <ul className="list-disc ml-6 my-2">
            <li>
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s, when an unknown printer took a galley
            </li>
            <li>
              of type and scrambled it to make a type specimen book. It has
              survived <br />
              <span className="italic">
                not only five centuries, but also the leap into electronic
              </span>
            </li>
          </ul>
          <p className="font-bold">Lorem Ipsum</p> is simply dummy text of
          the printing
        </div>
      </div>

      {/* Additional Section */}
      <h2 className="text-xl font-semibold mb-4">Other Details</h2>
      {/* Empty space for future content */}

      {/* Save Button */}
      <div className="mt-8 text-right">
        <button className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
          Add
        </button>
      </div>
    </div>
  )
}

export default HousesDetails
