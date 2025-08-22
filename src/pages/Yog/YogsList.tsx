import React from "react";
import { LayoutGrid, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

const yogs = [
  { name: "Dharma Yoga", value: "4-9-2" },
  { name: "Shakti Yoga", value: "3-5-7" },
  { name: "Dhan Yoga", value: "8-1-6" },
  { name: "Sthirta Yoga", value: "4-3-8" },
  { name: "Netrutva Yoga", value: "9-5-1" },
  { name: "Bhavna Yoga", value: "2-7-6" },
  { name: "Santulan Yoga", value: "4-5-6" },
  { name: "Adhyatmik Yoga", value: "2-5-8" },
];

const YogsList: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table");
  const navigate = useNavigate();
  const handleNavigate = (yog: { name: string; value: string }) => {
    // Example navigation, adjust as needed
    navigate("/yogs/edit", {
      state: { yogName: yog.name, yogValue: yog.value },
    });
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Yogs List
        </h1>
        <div className="flex gap-2">
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
      </div>
      {viewMode === "table" ? (
        <div className="bg-white   overflow-x-auto dark:bg-gray-900">
          <ul className="divide-y divide-gray-200">
            {yogs.map((yog) => (
              <li
                key={yog.name}
                className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleNavigate(yog)}
              >
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  {yog.name} - {yog.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-4">
          {yogs.map((yog) => (
            <div
              key={yog.name}
              className="border border-gray-400 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition"
              onClick={() => handleNavigate(yog)}
            >
              <div className="text-xl font-semibold text-gray-800 text-center">
                {yog.name}
              </div>
              <div className="mt-2 text-base text-gray-600">{yog.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YogsList;
