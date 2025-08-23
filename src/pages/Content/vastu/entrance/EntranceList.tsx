import React, { useState } from "react";
import { List, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";

const entrances = [
  "N1","N2","N3","N4","N5","N6","N7","N8",
  "E1","E2","E3","E4","E5","E6","E7","E8",
  "S1","S2","S3","S4","S5","S6","S7","S8",
  "W1","W2","W3","W4","W5","W6","W7","W8"
];

const EntranceList: React.FC = () => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-10 xl:py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Entrance</h1>
        <div className="flex items-center gap-4">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md border ${viewMode === "table" ? "bg-gray-200 border-gray-300" : "bg-white border-gray-300"}`}
              title="Table View"
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md border ${viewMode === "grid" ? "bg-gray-200 border-gray-300" : "bg-white border-gray-300"}`}
              title="Grid View"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>
          <span className="text-gray-500 text-sm">Total: {entrances.length}</span>
        </div>
      </div>

      {viewMode === "table" ? (
        <ul className="divide-y divide-gray-200">
          {entrances.map((choice, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-50"
              onClick={() =>
                navigate("/vastu/entrance/details", { state: { entranceId: choice.toLowerCase() } })
              }
            >
              <span className="text-base font-medium text-gray-900">{choice.toLowerCase()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-4">
          {entrances.map((choice, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition"
              onClick={() =>
                navigate("/vastu/entrance/details", { state: { entranceId: choice.toLowerCase() } })
              }
            >
              <div className="text-xl font-semibold text-gray-800 text-center">{choice.toLowerCase()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EntranceList;
