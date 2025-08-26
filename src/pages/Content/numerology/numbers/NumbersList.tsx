import { ChevronRight, LayoutGrid, List } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const staticNumbers = [
  { number: 1 },
  { number: 2 },
  { number: 3 },
  { number: 4 },
  { number: 5 },
  { number: 6 },
  { number: 7 },
  { number: 8 },
  { number: 9 },
];

const NumbersList: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table");
  const navigate = useNavigate();
  const handleNavigate = (number: number) => {
    navigate("/numerology/numbers/edit", {
      state: { numberId: number },
    });
  };
  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Numerology Numbers
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
        <div className="bg-white  overflow-x-auto dark:bg-gray-900">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {staticNumbers.map((item) => (
              <li
                key={item.number}
                className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleNavigate(item.number)}
              >
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  Number - {item.number}
                </span>
                <ChevronRight className="" />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-4">
          {staticNumbers.map((item) => (
            <div
              key={item.number}
              className="border border-gray-400 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition"
              onClick={() => handleNavigate(item.number)}
            >
              <div className="text-xl font-semibold text-gray-800 text-center">
                Number - {item.number}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NumbersList;
