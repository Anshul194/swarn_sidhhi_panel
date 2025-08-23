import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEntranceById } from "../../../../store/slices/entrance";
import { RootState, AppDispatch } from "../../../../store";

const EntranceDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const entranceId = location.state?.entranceId;

  const entranceDetails = useSelector((state: RootState) => state.entrance.entranceDetails);
  const loading = useSelector((state: RootState) => state.entrance.loading);
  const error = useSelector((state: RootState) => state.entrance.error);
  const token = useSelector((state: RootState) => state.auth.token);

  const [meaningEn, setMeaningEn] = useState("");
  const [meaningHi, setMeaningHi] = useState("");

  // Fetch entrance details on load
  useEffect(() => {
    if (entranceId && token) {
      dispatch(fetchEntranceById({ id: entranceId.toLowerCase(), token }));
    }
  }, [entranceId, token, dispatch]);

  // Initialize local states when entranceDetails load
  useEffect(() => {
    if (entranceDetails) {
      setMeaningEn(entranceDetails.meaning_en || "");
      setMeaningHi(entranceDetails.meaning_hi || "");
    }
  }, [entranceDetails]);

  return (
    <div className="min-h-screen max-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 xl:px-10 xl:py-12 mx-auto overflow-y-auto">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">
        Entrance {entranceId?.toUpperCase() || "Not Found"}
      </h2>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {entranceDetails && (
        <>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Details</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* English Meaning */}
              <div className="border rounded p-4">
                <h4 className="font-semibold mb-2">Meaning (English)</h4>
                <p className="text-gray-800">{meaningEn || "N/A"}</p>
              </div>

              {/* Hindi Meaning */}
              <div className="border rounded p-4">
                <h4 className="font-semibold mb-2">Meaning (Hindi)</h4>
                <p className="text-gray-800">{meaningHi || "N/A"}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EntranceDetails;
