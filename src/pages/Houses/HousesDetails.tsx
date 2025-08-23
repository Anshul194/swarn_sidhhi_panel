import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // added useNavigate
import { useDispatch, useSelector } from "react-redux";
import { fetchHouseById } from "../../store/slices/houses";

const HousesDetails = () => {
  const location = useLocation();
  const navigate = useNavigate(); // added
  const houseLabel = location.state?.houseLabel || "House: 1st";
  const houseId = location.state?.houseId || 1;
  const dispatch = useDispatch();
  const houseDetails = useSelector((state: any) => state.house?.houseDetails); // updated selector
  const loading = useSelector((state: any) => state.house?.loading);
  const error = useSelector((state: any) => state.house?.error);

  useEffect(() => {
    if (houseId) {
      dispatch(fetchHouseById({ id: houseId }));
    }
  }, [dispatch, houseId]);

  const details = houseDetails?.details;
  const planets = houseDetails?.planets || [];

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 xl:px-10 xl:py-12 mx-auto">
      {/* Back Button */}
      <button
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mb-8">{houseLabel}</h1>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* House Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="border rounded-lg p-6">
          <h3 className="font-bold mb-2">Meaning (English)</h3>
          <div className="text-sm whitespace-pre-line">
            {details?.description_en || "No data available."}
          </div>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-bold mb-2">Meaning (Hindi)</h3>
          <div className="text-sm whitespace-pre-line">
            {details?.description_hi || "No data available."}
          </div>
        </div>
      </div>

      {/* Planets Section */}

      <>
        {planets.map((planet: any) => (
          <div key={planet.name} className="mb-10">
            <h2 className="text-xl font-bold mb-4 capitalize">
              {planet.name === "sun"
                ? "Sun"
                : planet.name === "moon"
                ? "Moon House"
                : planet.name.charAt(0).toUpperCase() +
                  planet.name.slice(1) +
                  " House"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border rounded-lg p-6">
                <h3 className="font-bold mb-2">
                  {planet.name.charAt(0).toUpperCase() + planet.name.slice(1)}{" "}
                  in House {houseId} Meaning (English)
                </h3>
                <div className="text-sm whitespace-pre-line">
                  {planet.pros_en || "No data available."}
                </div>
                <div className="mt-2 text-sm whitespace-pre-line font-semibold">
                  {planet.cons_en || ""}
                </div>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-bold mb-2">
                  {planet.name.charAt(0).toUpperCase() + planet.name.slice(1)}{" "}
                  in House {houseId} Meaning (Hindi)
                </h3>
                <div className="text-sm whitespace-pre-line">
                  {planet.pros_hi || "No data available."}
                </div>
                <div className="mt-2 text-sm whitespace-pre-line font-semibold">
                  {planet.cons_hi || ""}
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    </div>
  );
};

export default HousesDetails;
