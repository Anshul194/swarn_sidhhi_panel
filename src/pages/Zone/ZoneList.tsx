import React, { useState } from "react";
import { List, LayoutGrid, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const zones = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WNW",
  "NW",
  "NNW",
];

const ZoneList = () => {
  const [view, setView] = useState<"list" | "grid">("list");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Zone
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-md border border-gray-300 dark:border-gray-600 ${
                view === "list"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "bg-white dark:bg-gray-900"
              } hover:bg-gray-100 dark:hover:bg-gray-800`}
              title="List View"
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-md border border-gray-300 dark:border-gray-600 ${
                view === "grid"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "bg-white dark:bg-gray-900"
              } hover:bg-gray-100 dark:hover:bg-gray-800`}
              title="Grid View"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {view === "list" ? (
        <div className="bg-white  overflow-x-auto">
          <div className="space-y-4">
            {zones.map((zone, idx) => (
              <div
                key={idx}
                className="border-b pb-4 flex flex-col md:flex-row md:justify-between md:items-center cursor-pointer"
                onClick={() => navigate(`/zone/${zone.toLowerCase()}`)}
              >
                <div className="mb-2 md:mb-0 text-xl">{zone}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-4">
          {zones.length > 0 ? (
            zones.map((zone, idx) => (
              <div
                key={idx}
                className="border border-gray-400 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition"
                onClick={() => navigate(`/zone/${zone.toLowerCase()}`)}
              >
                <div className="text-xl font-semibold text-gray-800 text-center mb-1">
                  {zone}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-6 text-gray-400">
              No zones found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ZoneList;
