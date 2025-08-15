import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit3, Pencil } from "lucide-react";
import {
  createYearPrediction,
  fetchYearPredictionById,
  updateYearPrediction,
  deleteYearPrediction,
} from "../../../../store/slices/yearPredictions";
import { RootState } from "../../../../store";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import TiptapEditor from "../../../../components/TiptapEditor";

const EditYearPrediction: React.FC = () => {
  // Edit modal states for prediction fields
  const [showPredictionEditModal, setShowPredictionEditModal] = useState(false);
  const [modalPredictionValue, setModalPredictionValue] = useState("");
  const [showPredictionEnEditModal, setShowPredictionEnEditModal] =
    useState(false);
  const [modalPredictionEnValue, setModalPredictionEnValue] = useState("");
  const [showPredictionHiEditModal, setShowPredictionHiEditModal] =
    useState(false);
  const [modalPredictionHiValue, setModalPredictionHiValue] = useState("");
  const dispatch = useDispatch();
  const { selectedPrediction, loading, error } = useSelector(
    (state: RootState) => state.yearPredictions
  );

  // Form state - now includes all five fields
  const [mulank, setMulank] = useState(0);
  const [year, setYear] = useState(0);
  const location = useLocation();
  const yearPredictionId = location.state?.yearPredictionId;
  const navigate = useNavigate();

  // All prediction fields
  const [prediction, setPrediction] = useState("");
  const [predictionEn, setPredictionEn] = useState("");
  const [predictionHi, setPredictionHi] = useState("");

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [addedSuccess, setAddedSuccess] = useState(false);

  // DELETE: popup state and handlers
  // DELETE: popup state and handlers for Year Prediction
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [yearPredictionToDelete, setYearPredictionToDelete] = useState<
    string | number | undefined
  >(undefined);

  // Open confirmation popup and set year prediction to delete
  const handleDeleteClick = (
    yearPredictionIdToDelete: string | number | undefined
  ) => {
    if (!yearPredictionIdToDelete) return;
    setYearPredictionToDelete(yearPredictionIdToDelete);
    setShowDeletePopup(true);
  };

  // Cancel delete popup
  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setYearPredictionToDelete(undefined);
  };

  // Confirm deletion, call Year Prediction API, close popup, redirect to year prediction list with toast
  const handleConfirmDelete = async () => {
    if (!yearPredictionToDelete) return;
    try {
      await dispatch(deleteYearPrediction(yearPredictionToDelete));
      setShowDeletePopup(false);
      setYearPredictionToDelete(undefined);
      toast.success("Year Prediction Deleted Successfully");
      navigate("/numerology/year-prediction/list", {
        state: { deleted: true },
      });
    } catch (err) {
      toast.error("Failed to delete year prediction. Please try again.");
    }
  };

  // Validate form - now includes all prediction fields
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!year) errors.year = "Year number is required";
    if (!mulank) errors.mulank = "Mulank number is required";
    if (!prediction.trim()) errors.prediction = "Prediction is required";
    if (!predictionEn.trim())
      errors.predictionEn = "Prediction (English) is required";
    if (!predictionHi.trim())
      errors.predictionHi = "Prediction (Hindi) is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission - now includes all five fields
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Log the data being sent to debug
    const formData = {
      mulank_number: mulank,
      year_number: year,
      prediction: prediction, // General prediction
      prediction_en: predictionEn, // English prediction
      prediction_hi: predictionHi, // Hindi prediction
    };

    console.log("Form data being sent:", formData);

    dispatch(
      updateYearPrediction({
        id: yearPredictionId,
        data: formData,
      })
    ).then((action: any) => {
      if (updateYearPrediction.fulfilled.match(action)) {
        setAddedSuccess(true);
        toast.success("Year Prediction updated successfully!");
        setTimeout(() => setAddedSuccess(false), 2500);
      }
    });
  };

  const getData = async () => {
    if (yearPredictionId) {
      console.log("Fetching year prediction by ID:", yearPredictionId);
      const response = await dispatch(
        fetchYearPredictionById(yearPredictionId)
      );
      const data: any = response.payload;
      if (fetchYearPredictionById.fulfilled.match(response)) {
        console.log("Fetched Year Prediction:", data);

        // Set values with proper fallbacks and logging
        setMulank(data.mulank_number || 0);
        setYear(data.year_number || 0);

        // Handle prediction fields separately to avoid cross-contamination
        const generalPrediction = data.prediction || "";
        const englishPrediction = data.prediction_en || "";
        const hindiPrediction = data.prediction_hi || "";

        console.log("Setting prediction values:", {
          general: generalPrediction,
          english: englishPrediction,
          hindi: hindiPrediction,
        });

        setPrediction(generalPrediction);
        setPredictionEn(englishPrediction);
        setPredictionHi(hindiPrediction);
      } else {
        toast.error("Failed to fetch year prediction");
      }
    } else {
      // If no yearPredictionId is provided, redirect to content/all
      toast.error("No year prediction ID provided");
      navigate("/numerology/year-predictions/list");
    }
  };

  useEffect(() => {
    getData();
  }, [dispatch, yearPredictionId, navigate]);

  console.log("Selected Year Prediction:", selectedPrediction);
  useEffect(() => {
    if (selectedPrediction) {
      setMulank(selectedPrediction.mulank_number);
      setYear(selectedPrediction.year_number);
      setPrediction(selectedPrediction.prediction || "");
      setPredictionEn(
        selectedPrediction.prediction_en || selectedPrediction.prediction || ""
      );
      setPredictionHi(selectedPrediction.prediction_hi || "");
    }
  }, [selectedPrediction]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Edit3 className="h-8 w-8" />
        Edit Year Prediction
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Year and Mulank Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="year_number"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Year Number*
            </label>
            <input
              id="year_number"
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {formErrors.year && (
              <p className="mt-1 text-sm text-red-600">{formErrors.year}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="mulank"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mulank Number*
            </label>
            <input
              id="mulank"
              type="text"
              value={mulank}
              onChange={(e) => setMulank(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {formErrors.mulank && (
              <p className="mt-1 text-sm text-red-600">{formErrors.mulank}</p>
            )}
          </div>
        </div>

        {/* Prediction Fields */}
        <div className="space-y-6 mb-6">
          {/* General Prediction */}
          <div>
            <label
              htmlFor="prediction"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              Prediction (General) *
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                onClick={() => {
                  setModalPredictionValue(prediction);
                  setShowPredictionEditModal(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </label>
            <div
              className="min-h-[200px] p-4 border border-gray-300 rounded-md overflow-auto prose max-w-none"
              dangerouslySetInnerHTML={{ __html: prediction }}
            />
            {formErrors.prediction && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.prediction}
              </p>
            )}
            {/* Edit Modal for General Prediction */}
            {showPredictionEditModal && (
              <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                  <h2 className="text-lg font-semibold mb-4">
                    Edit General Prediction
                  </h2>
                  <TiptapEditor
                    value={modalPredictionValue}
                    onChange={setModalPredictionValue}
                    height="300px"
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => setShowPredictionEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => {
                        setPrediction(modalPredictionValue);
                        setShowPredictionEditModal(false);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Prediction Fields in Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Prediction English */}
            <div>
              <label
                htmlFor="prediction_en"
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
              >
                Prediction (English) *
                <button
                  type="button"
                  className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                  onClick={() => {
                    setModalPredictionEnValue(predictionEn);
                    setShowPredictionEnEditModal(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </label>
              <div
                className="min-h-[200px] p-4 border border-gray-300 rounded-md overflow-auto prose max-w-none"
                dangerouslySetInnerHTML={{ __html: predictionEn }}
              />
              {formErrors.predictionEn && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.predictionEn}
                </p>
              )}
              {/* Edit Modal for Prediction English */}
              {showPredictionEnEditModal && (
                <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                    <h2 className="text-lg font-semibold mb-4">
                      Edit Prediction (English)
                    </h2>
                    <TiptapEditor
                      value={modalPredictionEnValue}
                      onChange={setModalPredictionEnValue}
                      height="300px"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={() => setShowPredictionEnEditModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => {
                          setPredictionEn(modalPredictionEnValue);
                          setShowPredictionEnEditModal(false);
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Prediction Hindi */}
            <div>
              <label
                htmlFor="prediction_hi"
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
              >
                Prediction (Hindi) *
                <button
                  type="button"
                  className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                  onClick={() => {
                    setModalPredictionHiValue(predictionHi);
                    setShowPredictionHiEditModal(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </label>
              <div
                className="min-h-[200px] p-4 border border-gray-300 rounded-md overflow-auto prose max-w-none"
                dangerouslySetInnerHTML={{ __html: predictionHi }}
              />
              {formErrors.predictionHi && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.predictionHi}
                </p>
              )}
              {/* Edit Modal for Prediction Hindi */}
              {showPredictionHiEditModal && (
                <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                    <h2 className="text-lg font-semibold mb-4">
                      Edit Prediction (Hindi)
                    </h2>
                    <TiptapEditor
                      value={modalPredictionHiValue}
                      onChange={setModalPredictionHiValue}
                      height="300px"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={() => setShowPredictionHiEditModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => {
                          setPredictionHi(modalPredictionHiValue);
                          setShowPredictionHiEditModal(false);
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Prediction"}
          </button>
          <button
            type="button"
            className="w-full md:w-auto px-6 py-3 rounded-md font-medium text-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-600 text-white hover:bg-red-700"
            aria-label="Delete prediction"
            onClick={() => handleDeleteClick(yearPredictionId)}
            disabled={loading || !yearPredictionId}
          >
            Delete Prediction
          </button>
        </div>

        {addedSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium text-center">
            Year Prediction updated successfully!
          </div>
        )}
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </form>
      {/* DELETE: Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete?
            </h2>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditYearPrediction;
