import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchKarmaKundliAnalysis } from "../../store/slices/newAnalytics";

const AnalyticsDetails = () => {
  const location = useLocation();
  const mbtiType = location.state?.mbtiType || "ISTJ";
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state: any) => state.newAnalytics
  );

  useEffect(() => {
    if (mbtiType) {
      dispatch(fetchKarmaKundliAnalysis({ type: mbtiType }));
    }
  }, [dispatch, mbtiType]);

  const getElement = (element: string) =>
    data.find((item: any) => item.element === element) || {};
  const career = getElement("career");
  const health = getElement("health");
  const relationship = getElement("relationship");

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 xl:px-10 xl:py-12 mx-auto">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-center mb-8">Karma: {mbtiType}</h1>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Career Section */}
      <h2 className="text-xl font-semibold mb-4">Career</h2>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-5">
          <h3 className="font-semibold mb-2">Career Prediction (English)</h3>
          <div className="text-sm whitespace-pre-line">
            {career.description_en || "No data available."}
          </div>
        </div>
        <div className="border rounded-lg p-5">
          <h3 className="font-semibold mb-2">Career Prediction (Hindi)</h3>
          <div className="text-sm whitespace-pre-line">
            {career.description_hi || "No data available."}
          </div>
        </div>
      </div>

      {/* Health Section */}
      <h2 className="text-xl font-semibold mb-4">Health</h2>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-5">
          <h3 className="font-semibold mb-2">Health Prediction (English)</h3>
          <div className="text-sm whitespace-pre-line">
            {health.description_en || "No data available."}
          </div>
        </div>
        <div className="border rounded-lg p-5">
          <h3 className="font-semibold mb-2">Health Prediction (Hindi)</h3>
          <div className="text-sm whitespace-pre-line">
            {health.description_hi || "No data available."}
          </div>
        </div>
      </div>

      {/* Relationship Section */}
      <h2 className="text-xl font-semibold mb-4">Relationship</h2>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-5">
          <h3 className="font-semibold mb-2">
            Relationship Prediction (English)
          </h3>
          <div className="text-sm whitespace-pre-line">
            {relationship.description_en || "No data available."}
          </div>
        </div>
        <div className="border rounded-lg p-5">
          <h3 className="font-semibold mb-2">
            Relationship Prediction (Hindi)
          </h3>
          <div className="text-sm whitespace-pre-line">
            {relationship.description_hi || "No data available."}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 text-right">
        <button className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
          Add
        </button>
      </div>
    </div>
  );
};

export default AnalyticsDetails;
