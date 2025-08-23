import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalysisByType } from "../../store/slices/analysis";
import { RootState } from "../../store";

const sectionTitles: Record<string, string> = {
  career: "Career",
  health: "Health",
  relationship: "Relationship",
  // Add more mappings as needed
};

interface AnalysisItem {
  element: string;
  description_en: string;
  description_hi: string;
}

const AnalyticsDetails: React.FC = () => {
  const location = useLocation();
  const mbtiType = (location.state?.mbtiType || "ISTJ").toLowerCase();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token) || localStorage.getItem("token");
  const { data: analysisData, loading, error } = useSelector(
    (state: RootState) => state.analysis
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchAnalysisByType({ type: mbtiType, token }));
    }
  }, [mbtiType, dispatch, token]);

  // Fallback dummy data if nothing is fetched yet
  const displayData: AnalysisItem[] =
    analysisData.length > 0
      ? analysisData
      : [
          {
            element: "career",
            description_en: "Lorem Ipsum Career English",
            description_hi: "Lorem Ipsum Career Hindi",
          },
          {
            element: "health",
            description_en: "Lorem Ipsum Health English",
            description_hi: "Lorem Ipsum Health Hindi",
          },
          {
            element: "relationship",
            description_en: "Lorem Ipsum Relationship English",
            description_hi: "Lorem Ipsum Relationship Hindi",
          },
        ];

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 xl:px-10 xl:py-12 mx-auto">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-center mb-8">
        Karma: {mbtiType.toUpperCase()}
      </h1>

      {/* Error Display */}
      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          {displayData.map((item, idx) => (
            <div key={idx} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {sectionTitles[item.element] || item.element}
              </h2>

              <div className="grid grid-cols-2 gap-6">
                {/* English */}
                <div className="border rounded-lg p-5">
                  <h3 className="font-semibold mb-2">
                    {sectionTitles[item.element]} Prediction (English)
                  </h3>
                  <p>{item.description_en}</p>
                  <ul className="list-disc ml-6 my-2">
                    <li>
                      Lorem Ipsum has been the industry's standard dummy text ever
                      since the 1500s.
                    </li>
                    <li>
                      It has survived <span className="italic">not only five centuries</span> 
                      but also the leap into electronic typesetting.
                    </li>
                  </ul>
                </div>

                {/* Hindi */}
                <div className="border rounded-lg p-5">
                  <h3 className="font-semibold mb-2">
                    {sectionTitles[item.element]} Prediction (Hindi)
                  </h3>
                  <p>{item.description_hi}</p>
                  <ul className="list-disc ml-6 my-2">
                    <li>
                      Lorem Ipsum has been the industry's standard dummy text ever
                      since the 1500s.
                    </li>
                    <li>
                      It has survived <span className="italic">not only five centuries</span> 
                      but also the leap into electronic typesetting.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

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
