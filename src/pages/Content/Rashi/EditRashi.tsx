import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { fetchRashiDetails } from "../../../store/slices/rashi";

const EditRashi: React.FC = () => {
  const location = useLocation();
  const rashiName = location.state?.rashiName || "Aries";
  const dispatch = useAppDispatch();
  const {
    data: rashiData,
    loading,
    error,
  } = useAppSelector((state) => state.rashi);

  useEffect(() => {
    if (rashiName) {
      dispatch(fetchRashiDetails({ name: rashiName }));
    }
  }, [rashiName, dispatch]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {loading && <div className="text-blue-600">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {rashiData && (
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center">
            Rashi: {rashiName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border rounded-lg p-4  max-h-72 overflow-y-scroll">
              <h3 className="font-semibold mb-2">Meaning (English)</h3>
              <div className="text-gray-700 whitespace-pre-line">
                {rashiData.details.short_description_en}
              </div>
              <div className="mt-4 text-gray-700 whitespace-pre-line">
                {rashiData.details.description_en}
              </div>
            </div>
            <div className="border rounded-lg p-4  max-h-72 overflow-y-scroll">
              <h3 className="font-semibold mb-2">Meaning (Hindi)</h3>
              <div className="text-gray-700 whitespace-pre-line">
                {rashiData.details.short_description_hi}
              </div>
              <div className="mt-4 text-gray-700 whitespace-pre-line">
                {rashiData.details.description_hi}
              </div>
            </div>
          </div>
          {/* House Wise Details */}
          {rashiData.houses.map((house, idx) => (
            <div key={house.name} className="mb-8">
              <h3 className="text-lg font-bold mb-2">{`${idx + 1}st House`}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4  max-h-72 overflow-y-scroll">
                  <h4 className="font-semibold mb-2">{`Planet in House ${
                    idx + 1
                  } Meaning (English)`}</h4>
                  <div className="mb-2 text-gray-700 whitespace-pre-line">
                    {house.description_en}
                  </div>
                </div>
                <div className="border rounded-lg p-4  max-h-72 overflow-y-scroll">
                  <h4 className="font-semibold mb-2">{`Planet in House ${
                    idx + 1
                  } Meaning (Hindi)`}</h4>
                  <div className="mb-2 text-gray-700 whitespace-pre-line">
                    {house.description_hi}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditRashi;
