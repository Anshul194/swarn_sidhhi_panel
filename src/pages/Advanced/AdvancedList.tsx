import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { List, LayoutGrid } from "lucide-react";

// Example advanced topics, replace or extend as needed
const advancedTopics = [
 "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Uranus",
  "Neptune",
  "Rahu",
  "Ketu",
];

const AdvancedList: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Planets
        </h1>
        <div className="flex items-center gap-4">
          {/* View toggle buttons */}
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
            Total: {advancedTopics.length}
          </span>
        </div>
      </div>

      {/* Table or Grid View */}
      {viewMode === "table" ? (
        <div className="bg-white overflow-x-auto dark:bg-gray-900">
          <ul className="divide-y divide-gray-200">
            {advancedTopics.map((topic, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() =>
                  navigate("/advanced/details", {
                    state: { topicName: topic },
                  })
                }
              >
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  {topic}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-4">
          {advancedTopics.map((topic, idx) => (
            <div
              key={idx}
              className="border border-gray-400 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition"
              onClick={() =>
                navigate("/advanced/edit", {
                  state: { topicName: topic },
                })
              }
            >
              <div className="text-xl font-semibold text-gray-800 text-center mb-1">
                {topic}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedList;
