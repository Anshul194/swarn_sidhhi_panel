import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../../store";

import { Edit3, Pencil } from "lucide-react";
import TiptapEditor from "../../../../components/TiptapEditor";
import { RootState } from "../../../../store";
import {
  createMissingNumberRemedy,
  fetchMissingNumberRemedyById,
  updateMissingNumberRemedy,
  deleteMissingNumberRemedy,
} from "../../../../store/slices/missingNumber";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";

const EditMissingNumber: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedRemedy, loading, error } = useSelector(
    (state: RootState) => state.missingNumber
  );

  // Form state - updated to match your requirements
  const [missing_number, setMissingNumber] = useState<number>(0);
  const [text, setText] = useState("");
  // Modal states for editing each field
  const [showTextEditModal, setShowTextEditModal] = useState(false);
  const [modalTextValue, setModalTextValue] = useState("");
  const [showTextEnEditModal, setShowTextEnEditModal] = useState(false);
  const [modalTextEnValue, setModalTextEnValue] = useState("");
  const [showTextHiEditModal, setShowTextHiEditModal] = useState(false);
  const [modalTextHiValue, setModalTextHiValue] = useState("");
  const [textEn, setTextEn] = useState("");
  const [textHi, setTextHi] = useState("");

  const location = useLocation();
  const missingNumberId = location.state?.missingNumberId;
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
      await dispatch(deleteMissingNumberRemedy(Number(missingNumberToDelete)));
      setShowDeletePopup(false);
      setMissingNumberToDelete(undefined);
      toast.success("Missing Number Deleted Successfully");
      navigate("/numerology/missing-number-remedies/list", {
        state: { deleted: true },
      });
    } catch (err) {
      toast.error("Failed to delete missing number. Please try again.");
    }
  };

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
        id: Number(missingNumberId),
        data: {
          missing_number: missing_number,
          text: text,
          text_en: textEn,
          text_hi: textHi,
        },
      })
    )
      .unwrap()
      .then(() => {
        setUpdateSuccess(true);
        toast.success("Missing number updated successfully!");
        setTimeout(() => setUpdateSuccess(false), 2500);
        getData();
        navigate("/numerology/missing-number-remedies/list", {
          state: { updated: true },
        });
      })
      .catch((err: any) => {
        toast.error(err?.message || err || "Failed to update missing number.");
      });
  };

  const getData = React.useCallback(async () => {
    if (missingNumberId) {
      try {
        const data = await dispatch(
          fetchMissingNumberRemedyById(Number(missingNumberId))
        ).unwrap();
        setMissingNumber(data.missing_number || 0);
        setText(data.text || "");
        setTextEn(data.text_en || "");
        setTextHi(data.text_hi || "");
      } catch {
        toast.error("Failed to fetch missing number");
      }
    } else {
      toast.error("No Missing Number ID provided");
      navigate("/numerology/personality/list");
    }
  }, [dispatch, missingNumberId, navigate]);

  useEffect(() => {
    getData();
  }, [dispatch, missingNumberId, navigate, getData]);

  console.log("Selected Missing Number:", selectedRemedy);
  useEffect(() => {
    if (selectedRemedy) {
      setMissingNumber(selectedRemedy.missing_number || 0);
      setText(selectedRemedy.text || "");
      setTextEn(selectedRemedy.text_en || "");
      setTextHi(selectedRemedy.text_hi || "");
    }
  }, [selectedRemedy]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Edit3 className="h-8 w-8" />
        Edit Missing Number Remedy - Markdown Editor
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Edit Modal Popups for each text field */}
        {/* General Text Edit Modal */}
        {showTextEditModal && (
          <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Edit Text</h2>
              <TiptapEditor
                value={modalTextValue}
                onChange={setModalTextValue}
                height="300px"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowTextEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => {
                    setText(modalTextValue);
                    setShowTextEditModal(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {/* English Text Edit Modal */}
        {showTextEnEditModal && (
          <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">
                Edit Text (English)
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
              <h2 className="text-lg font-semibold mb-4">Edit Text (Hindi)</h2>
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

        {/* Missing Number Field */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="">
            <label
              htmlFor="missing_number"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Missing Number*
            </label>
            <input
              id="missing_number"
              type="number"
              value={missing_number}
              onChange={(e) => setMissingNumber(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter missing number"
            />
            {formErrors.missing_number && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.missing_number}
              </p>
            )}
          </div>
        </div>

        {/* Text Fields - Preview only, edit via modal */}
        <div className="space-y-6 mb-6">
          {/* Text Field */}
          <div>
            <label
              htmlFor="text_field"
              className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2"
            >
              Text *
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                onClick={() => {
                  setModalTextValue(text);
                  setShowTextEditModal(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </label>
            <div
              className="min-h-[200px] p-4 border border-gray-300 rounded-md overflow-auto prose max-w-none"
              dangerouslySetInnerHTML={{ __html: text }}
            />
            {formErrors.text && (
              <p className="mt-1 text-sm text-red-600">{formErrors.text}</p>
            )}
          </div>

          {/* Text (English) Field */}
          <div>
            <label
              htmlFor="text_en_field"
              className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2"
            >
              Text (English) *
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
              className="min-h-[200px] p-4 border border-gray-300 rounded-md overflow-auto prose max-w-none"
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
              Text (Hindi) *
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
              className="min-h-[200px] p-4 border border-gray-300 rounded-md overflow-auto prose max-w-none"
              dangerouslySetInnerHTML={{ __html: textHi }}
            />
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
            {loading ? "Updating..." : "Update Missing Number"}
          </button>
          <button
            type="button"
            className="w-full md:w-auto px-6 py-3 rounded-md font-medium text-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-600 text-white hover:bg-red-700"
            aria-label="Delete article"
            onClick={() => handleDeleteClick(missingNumberId)}
            disabled={loading || !missingNumberId}
          >
            Delete Article
          </button>
        </div>

        {updateSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium text-center">
            Missing number updated successfully!
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
