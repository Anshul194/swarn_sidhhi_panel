import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchYogById } from "../../store/slices/yog";

const YogDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const yogId = location.state?.yogId || 123;
  const token = localStorage.getItem("token") || "";
  const yog = useSelector((state: any) => state.yog?.details);
  const loading = useSelector((state: any) => state.yog?.loading);
  const error = useSelector((state: any) => state.yog?.error);

  useEffect(() => {
    if (yogId && token) {
      dispatch(fetchYogById({ id: yogId, token }));
    }
  }, [dispatch, yogId, token]);

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 xl:px-10 xl:py-12 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Yog Details - {yogId}
      </h2>

      {/* Details Section */}
      {yog && (
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-6 mr-10 ">
            <div className="flex items-center space-x-2">
              <label className="font-medium w-32">Title English:</label>
              <div className="flex-1 border rounded p-2 text-gray-700">
                {yog.title_en}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <label className="font-medium w-32">Title Hindi:</label>
              <div className="flex-1 border rounded p-2 text-gray-700">
                {yog.title_hi}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <label className="font-medium w-32">Tags:</label>
              <div className="flex-1 border rounded p-2 text-gray-700">
                {Array.isArray(yog.tags) ? yog.tags.join(", ") : yog.tags}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meanings Section */}
      {yog && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="border rounded-lg p-6">
            <h3 className="font-bold mb-2">Present Meaning (English)</h3>
            <div className="text-sm whitespace-pre-line">
              {yog.present_meaning_en || "No data available."}
            </div>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-bold mb-2">Present Meaning (Hindi)</h3>
            <div className="text-sm whitespace-pre-line">
              {yog.present_meaning_hi || "No data available."}
            </div>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-bold mb-2">Missing Meaning (English)</h3>
            <div className="text-sm whitespace-pre-line">
              {yog.missing_meaning_en || "No data available."}
            </div>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-bold mb-2">Missing Meaning (Hindi)</h3>
            <div className="text-sm whitespace-pre-line">
              {yog.missing_meaning_hi || "No data available."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YogDetails;
