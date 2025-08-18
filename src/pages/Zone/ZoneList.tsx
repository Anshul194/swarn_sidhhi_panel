import React from "react";

const zones = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S",
  "SSW", "SW", "WNW", "NW", "NNW"
];

const ZoneList = () => {
  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Zone List</h2>
      <div className="space-y-4">
        {zones.map((zone, idx) => (
          <div
            key={idx}
            className="border-b pb-4 flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <div className="mb-2 md:mb-0">
              {zone}
            </div>
          </div>
        ))}
      </div>
    
    </div>
  );
};

export default ZoneList;
