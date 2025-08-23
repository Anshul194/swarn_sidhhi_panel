import React, { useState } from "react";
import { List, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";

const houses = [
  "house1",
  "house2",
  "house3",
  "house4",
  "house5",
  "house6",
  "house7",
  "house8",
  "house9",
  "house10",
  "house11",
  "house12",
];

// Function to add ordinal suffix
const getOrdinal = (n: number) => {
  if (n % 100 >= 11 && n % 100 <= 13) return n + "th";
  switch (n % 10) {
    case 1:
      return n + "st";
    case 2:
      return n + "nd";
    case 3:
      return n + "rd";
    default:
      return n + "th";
  }
};

// Table view format: House 1st, 2nd, etc.
const formatHouseTable = (house: string, index: number) => {
  const match = house.match(/([a-zA-Z]+)(\d+)/);
  if (match) {
    const [_, text] = match;
    return text.charAt(0).toUpperCase() + text.slice(1) + " " + getOrdinal(index + 1);
  }
  return house;
};

// Grid/Box view format: House 1, 2, etc.
const formatHouseBox = (house: string) => {
  const match = house.match(/([a-zA-Z]+)(\d+)/);
  if (match) {
    const [_, text, number] = match;
    return text.charAt(0).toUpperCase() + text.slice(1) + " " + number;
  }
  return house;
};

const Houses = () => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const navigate = useNavigate();

  const handleHouseClick = (house: string, idx: number) => {
    navigate("/houses/details", {
      state: {
        house,
        houseIndex: idx,
        houseLabel: formatHouseTable(house, idx),
        houseId: idx + 1, // Pass correct house ID (1-based)
      },
    });
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Houses
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md border border-gray-300 dark:border-gray-600 ${
                viewMode === "table"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "bg-white dark:bg-gray-900"
              } hover:bg-gray-100 dark:hover:bg-gray-800`}
              title="Table View"
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md border border-gray-300 dark:border-gray-600 ${
                viewMode === "grid"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "bg-white dark:bg-gray-900"
              } hover:bg-gray-100 dark:hover:bg-gray-800`}
              title="Grid View"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>
          <span className="text-gray-500 text-sm dark:text-gray-400">
            Total: {houses.length}
          </span>
        </div>
      </div>

      {/* Table or Grid View */}
      {viewMode === "table" ? (
        <div className="bg-white overflow-x-auto dark:bg-gray-900">
          <ul className="divide-y divide-gray-200">
            {houses.map((house, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleHouseClick(house, idx)}
              >
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  {formatHouseTable(house, idx)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-4">
          {houses.map((house, idx) => (
            <div
              key={idx}
              className="border border-gray-400 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition"
              onClick={() => handleHouseClick(house, idx)}
            >
              <div className="text-xl font-semibold text-gray-800 text-center mb-1">
                {formatHouseBox(house)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Houses;
