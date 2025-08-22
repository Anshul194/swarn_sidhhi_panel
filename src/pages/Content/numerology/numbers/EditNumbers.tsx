import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Edit3, Pencil } from "lucide-react";
import TiptapEditor from "../../../../components/TiptapEditor";
import { RootState } from "../../../../store";
import {
  fetchMissingNumberRemedyById,
  updateMissingNumberRemedy,
  deleteMissingNumberRemedy,
} from "../../../../store/slices/missingNumber";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";

const EditMissingNumber: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedRemedy, loading, error } = useSelector(
    (state: RootState) => state.rashi
  );

  // Form state - updated to match your requirements
  const [missing_number, setMissingNumber] = useState("");
  const [text, setText] = useState("");
  const [textEn, setTextEn] = useState("");
  const [textHi, setTextHi] = useState("");

  const location = useLocation();
  const missingNumberId = location.state?.missingNumberId;
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Modal states for editing each field
  const [showTextEditModal, setShowTextEditModal] = useState(false);
  const [modalTextValue, setModalTextValue] = useState("");
  const [showTextEnEditModal, setShowTextEnEditModal] = useState(false);
  const [modalTextEnValue, setModalTextEnValue] = useState("");
  const [showTextHiEditModal, setShowTextHiEditModal] = useState(false);
  const [modalTextHiValue, setModalTextHiValue] = useState("");

  // Markdown helper functions

  // DELETE: popup state and handlers
  // DELETE: popup state and handlers for Missing Number
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [missingNumberToDelete, setMissingNumberToDelete] = useState<
    string | number | undefined
  >(undefined);

  // Open confirmation popup and set missing number to delete
  const handleDeleteClick = (
    missingNumberIdToDelete: string | number | undefined
  ) => {
    if (!missingNumberIdToDelete) return;
    setMissingNumberToDelete(missingNumberIdToDelete);
    setShowDeletePopup(true);
  };

  // Cancel delete popup
  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setMissingNumberToDelete(undefined);
  };

  // Confirm deletion, call Missing Number API, close popup, redirect to missing number list with toast
  const handleConfirmDelete = async () => {
    if (!missingNumberToDelete) return;
    try {
      await dispatch(deleteMissingNumberRemedy(missingNumberToDelete));
      setShowDeletePopup(false);
      setMissingNumberToDelete(undefined);
      toast.success("Number Deleted Successfully");
      navigate("/numerology/missing-number-remedies/list", {
        state: { deleted: true },
      });
    } catch (err) {
      toast.error("Failed to delete number. Please try again.");
    }
  };

  // Render markdown as HTML (simple implementation)

  // Validate form - updated for new fields
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!missing_number) errors.missing_number = "Missing number is required";
    if (!text.trim()) errors.text = "Text is required";
    if (!textEn.trim()) errors.textEn = "Text (English) is required";
    if (!textHi.trim()) errors.textHi = "Text (Hindi) is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission - updated for new fields
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(
      updateMissingNumberRemedy({
        id: missingNumberId,
        data: {
          missing_number: missing_number,
          text: text,
          text_en: textEn,
          text_hi: textHi,
        },
      })
    ).then((action: any) => {
      if (updateMissingNumberRemedy.fulfilled.match(action)) {
        setUpdateSuccess(true);
        toast.success("Number updated successfully!");

        setTimeout(() => setUpdateSuccess(false), 2500);
      }
    });
  };

  const getData = async () => {
    if (missingNumberId) {
      console.log("Fetching missing number by ID:", missingNumberId);
      const response = await dispatch(
        fetchMissingNumberRemedyById(missingNumberId)
      );
      const data = response.payload;
      if (fetchMissingNumberRemedyById.fulfilled.match(response)) {
        console.log("Fetched Missing Number:", data);
        setMissingNumber(data.missing_number || "");
        setText(data.text || "");
        setTextEn(data.text_en || "");
        setTextHi(data.text_hi || "");
      } else {
        toast.error("Failed to fetch missing number");
      }
    } else {
      // If no missingNumberId is provided, redirect to content/all
      toast.error("No Number ID provided");
      navigate("/numerology/personality/list");
    }
  };

  useEffect(() => {
    getData();
  }, [dispatch, missingNumberId, navigate]);

  console.log("Selected Missing Number:", selectedRemedy);
  useEffect(() => {
    if (selectedRemedy) {
      setMissingNumber(selectedRemedy.missing_number || "");
      setText(selectedRemedy.text || "");
      setTextEn(selectedRemedy.text_en || "");
      setTextHi(selectedRemedy.text_hi || "");
    }
  }, [selectedRemedy]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center justify-center gap-2">
        <Edit3 className="h-8 w-8 " />
        Number - {missing_number}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Edit Modal Popups for each text field */}

        {/* English Text Edit Modal */}
        {showTextEnEditModal && (
          <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">
                Edit Positive (English)
              </h2>
              <TiptapEditor
                value={modalTextEnValue}
                onChange={setModalTextEnValue}
                height="300px"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowTextEnEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => {
                    setTextEn(modalTextEnValue);
                    setShowTextEnEditModal(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Hindi Text Edit Modal */}
        {showTextHiEditModal && (
          <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">
                Edit Positive (Hindi)
              </h2>
              <TiptapEditor
                value={modalTextHiValue}
                onChange={setModalTextHiValue}
                height="300px"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowTextHiEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => {
                    setTextHi(modalTextHiValue);
                    setShowTextHiEditModal(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Text Fields */}
        <h2 className="text-lg font-semibold mb-2">Personality</h2>
        <div className="space-y-6 mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Text (English) Field */}
          <div>
            <label
              htmlFor="text_en_field"
              className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2"
            >
              Positive (English) *
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                onClick={() => {
                  setModalTextEnValue(textEn);
                  setShowTextEnEditModal(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </label>
            <div
              className="h-[250px] p-4 border border-gray-300 rounded-md overflow-auto prose max-w-none"
              dangerouslySetInnerHTML={{ __html: textEn }}
            />
            {formErrors.textEn && (
              <p className="mt-1 text-sm text-red-600">{formErrors.textEn}</p>
            )}
          </div>
          {/* Text (Hindi) Field */}
          <div>
            <label
              htmlFor="text_hi_field"
              className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2"
            >
              Positive (Hindi) *
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                onClick={() => {
                  setModalTextHiValue(textHi);
                  setShowTextHiEditModal(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </label>
            <div
              className="h-[250px] p-4 border border-gray-300 rounded-md overflow-auto prose max-w-none"
              dangerouslySetInnerHTML={{ __html: textHi }}
            />
            {formErrors.textHi && (
              <p className="mt-1 text-sm text-red-600">{formErrors.textHi}</p>
            )}
          </div>

          {/* Text (English) Field */}
          <div>
            <label
              htmlFor="text_en_field"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Negative (English) *{" "}
            </label>
            {false ? (
              <div
                className="min-h-[200px] p-4 border border-gray-300 rounded-md overflow-auto prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(textEn),
                }}
              />
            ) : (
              <textarea
                id="text_en_field"
                // value={textEn}
                onChange={(e) => setTextEn(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm"
                rows={10}
                placeholder="Enter English text content..."
              />
            )}
            {formErrors.textEn && (
              <p className="mt-1 text-sm text-red-600">{formErrors.textEn}</p>
            )}
          </div>

          {/* Text (Hindi) Field */}
          <div>
            <label
              htmlFor="text_hi_field"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Negative (Hindi) *{" "}
            </label>
            {false ? (
              <div
                className="min-h-[200px] p-4 border border-gray-300 rounded-md overflow-auto prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(textHi),
                }}
              />
            ) : (
              <textarea
                id="text_hi_field"
                // value={textHi}
                onChange={(e) => setTextHi(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm"
                rows={10}
                placeholder="हिंदी टेक्स्ट सामग्री दर्ज करें..."
              />
            )}
            {formErrors.textHi && (
              <p className="mt-1 text-sm text-red-600">{formErrors.textHi}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Number"}
          </button>
          <button
            type="button"
            className="w-full md:w-auto px-6 py-3 rounded-md font-medium text-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-600 text-white hover:bg-red-700"
            aria-label="Delete Number"
            onClick={() => handleDeleteClick(missingNumberId)}
            disabled={loading || !missingNumberId}
          >
            Delete Number
          </button>
        </div>

        {updateSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium text-center">
            Number updated successfully!
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

export default EditMissingNumber;
