import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPersonalYear } from "../../store/slices/personalYear";
import type { RootState } from "../../store";

const EditIcon = () => (
  <svg
    width="16"
    height="16"
    fill="currentColor"
    className="inline ml-2 text-gray-500 cursor-pointer"
    viewBox="0 0 20 20"
  >
    <path d="M17.414 2.586a2 2 0 0 1 0 2.828l-1.586 1.586-2.828-2.828 1.586-1.586a2 2 0 0 1 2.828 0zm-3.121 3.535l-8.486 8.486a1 1 0 0 0-.263.465l-1 4a1 1 0 0 0 1.213 1.213l4-1a1 1 0 0 0 .465-.263l8.486-8.486-4.415-4.415z" />
  </svg>
);

const PersonalDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.personalYear
  );

  useEffect(() => {
    dispatch(fetchPersonalYear());
  }, [dispatch]);

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-8 xl:px-10 xl:py-12 mx-auto">
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-center mb-6">
        Personal Year Details
      </h1>

      {/* Numerology Year Data Section */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Numerology Year Data</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && data.length > 0 && (
          <div className="space-y-10">
            {data.map((item: any) => (
              <div key={item.lifestyle}>
                <h3 className="text-xl font-bold mb-4 capitalize">
                  {item.lifestyle.replace("_", " ")}
                </h3>
                <div className="flex  gap-6 overflow-y-scroll no-scrollbar">
                  {[...Array(9)].map((_, i) => {
                    const num = String(i + 1);
                    const pred = item.predictions[num];
                    return (
                      <React.Fragment key={num}>
                        <div className="flex flex-col gap-6">
                          {/* Prediction EN Card */}
                          <div className="border rounded-lg p-4 shadow-sm bg-white w-2xs h-56">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold">
                                Number {num}: Prediction En
                              </span>
                              {/* <EditIcon /> */}
                            </div>
                            <div>
                              <span className="">
                                {pred?.prediction_en
                                  ? pred.prediction_en
                                  : "No prediction available."}
                              </span>
                            </div>
                          </div>
                          {/* Prediction HI Card */}
                          <div className="border rounded-lg p-4 shadow-sm bg-white w-2xs h-56">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold">
                                Number {num}: Prediction Hi
                              </span>
                              {/* <EditIcon /> */}
                            </div>
                            <div>
                              <span className="">
                                {pred?.prediction_hi
                                  ? pred.prediction_hi
                                  : "No prediction available."}
                              </span>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-8 text-right">
        <button className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
          Save
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;
