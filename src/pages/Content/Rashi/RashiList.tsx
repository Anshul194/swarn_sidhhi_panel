import React, { useState } from "react";
import { List, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";

const staticRashis = [
  { name: "Aries" },
  { name: "Taurus" },
  { name: "Gemini" },
  { name: "Cancer" },
  { name: "Leo" },
  { name: "Virgo" },
  { name: "Libra" },
  { name: "Scorpio" },
  { name: "Sagittarius" },
  { name: "Capricorn" },
  { name: "Aquarius" },
  { name: "Pisces" },
];

const RashiList: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-10 xl:py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Rashis</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-md border border-gray-300 ${
              viewMode === "table" ? "bg-gray-200" : "bg-white"
            } hover:bg-gray-100`}
            title="Table View"
          >
            <List className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md border border-gray-300 ${
              viewMode === "grid" ? "bg-gray-200" : "bg-white"
            } hover:bg-gray-100`}
            title="Grid View"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>
      </div>
      {viewMode === "table" ? (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <ul className="divide-y divide-gray-300">
            {staticRashis.map((item, idx) => (
              <li
                key={item.name}
                className="px-4 py-4 cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  navigate("/kundli/rashi/edit", {
                    state: { rashiName: item.name },
                  })
                }
              >
                <span className="text-base font-medium text-gray-900">
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-4">
          {staticRashis.map((item) => (
            <div
              key={item.name}
              className="border border-gray-400 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition"
              onClick={() =>
                navigate("/kundli/rashi/edit", {
                  state: { rashiName: item.name },
                })
              }
            >
              <div className="text-xl font-semibold text-gray-800 text-center">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RashiList;
