import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalysisByType } from "../../store/slices/analysis";
import { RootState } from "../../store"; // adjust import if needed

const sections = ["career", "health", "relationship"]; // can be extended dynamically

const AnalyticsDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mbtiType = location.state?.mbtiType || "ISTJ";
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.analysis);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    dispatch(fetchAnalysisByType({ type: mbtiType, token }));
  }, [mbtiType, dispatch]);

  // Helper to get analysis for a given element dynamically
  const getAnalysis = (element: string) => data.find((item) => item.element === element);

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 xl:px-10 xl:py-12 mx-auto">
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-center mb-8">Karma: {mbtiType}</h1>

      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Render each section dynamically */}
      {sections.map((section) => {
        const analysis = getAnalysis(section);

        return (
          <div key={section} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{section.charAt(0).toUpperCase() + section.slice(1)}</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="border rounded-lg p-5">
                <h3 className="font-semibold mb-2">{section.charAt(0).toUpperCase() + section.slice(1)} Prediction (English)</h3>
                <p>{analysis?.description_en || "No data available."}</p>
              </div>
              <div className="border rounded-lg p-5">
                <h3 className="font-semibold mb-2">{section.charAt(0).toUpperCase() + section.slice(1)} Prediction (Hindi)</h3>
                <p>{analysis?.description_hi || "No data available."}</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Save / Add Button */}
      <div className="mt-8 text-right">
        <button className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
          Add
        </button>
      </div>
    </div>
  );
};

export default AnalyticsDetails;
