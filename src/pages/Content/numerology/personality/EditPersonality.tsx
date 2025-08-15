import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit3, Pencil } from "lucide-react";
import {
  fetchPersonalityById,
  updatePersonality,
  deletePersonality,
} from "../../../../store/slices/personality";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { RootState } from "../../../../store";
import TiptapEditor from "../../../../components/TiptapEditor";

const EditPersonality: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedPersonality, loading, error } = useSelector(
    (state: RootState) => state.personality
  );
  const [mulank, setMulank] = useState(0);
  const location = useLocation();
  const personalityId = location.state?.personalityId;
  const navigate = useNavigate();
  const [positiveSide, setPositiveSide] = useState("");
  const [positiveSideHi, setPositiveSideHi] = useState("");
  const [negativeSide, setNegativeSide] = useState("");
  const [negativeSideHi, setNegativeSideHi] = useState("");

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Popup state for editing positive/negative sides
  const [showPositiveEditModal, setShowPositiveEditModal] = useState(false);
  const [showPositiveHiEditModal, setShowPositiveHiEditModal] = useState(false);
  const [showNegativeEditModal, setShowNegativeEditModal] = useState(false);
  const [showNegativeHiEditModal, setShowNegativeHiEditModal] = useState(false);
  const [tiptapModalPositive, setTiptapModalPositive] = useState("");
  const [tiptapModalPositiveHi, setTiptapModalPositiveHi] = useState("");
  const [tiptapModalNegative, setTiptapModalNegative] = useState("");
  const [tiptapModalNegativeHi, setTiptapModalNegativeHi] = useState("");

  // DELETE: popup state and handlers
  // DELETE: popup state and handlers for Personality
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [personalityToDelete, setPersonalityToDelete] = useState<
    string | number | undefined
  >(undefined);

  // Open confirmation popup and set personality to delete
  const handleDeleteClick = (
    personalityIdToDelete: string | number | undefined
  ) => {
    if (!personalityIdToDelete) return;
    setPersonalityToDelete(personalityIdToDelete);
    setShowDeletePopup(true);
  };

  // Cancel delete popup
  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setPersonalityToDelete(undefined);
  };

  // Confirm deletion, call Personality API, close popup, redirect to personality list with toast
  const handleConfirmDelete = async () => {
    if (!personalityToDelete) return;
    try {
      await dispatch(deletePersonality(personalityToDelete));
      setShowDeletePopup(false);
      setPersonalityToDelete(undefined);
      toast.success("Personality Deleted Successfully");
      navigate("/numerology/personality/list", { state: { deleted: true } });
    } catch (err) {
      toast.error("Failed to delete personality. Please try again.");
    }
  };

  // Validate form - removed title and content validation
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!positiveSide.trim()) errors.positiveSide = "Positive side is required";
    if (!negativeSide.trim()) errors.negativeSide = "Negative side is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission - removed title and content from form data
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Submitting Rashi with data:", {
      positiveSide,
      positiveSideHi,
      negativeSide,
      negativeSideHi,
    });

    dispatch(
      updatePersonality({
        id: personalityId,
        data: {
          mulank_number: mulank,
          positive_side: positiveSide,
          positive_side_hi: positiveSideHi,
          negative_side: negativeSide,
          negative_side_hi: negativeSideHi,
        },
      })
    ).then((action: any) => {
      if (updatePersonality.fulfilled.match(action)) {
        setAddedSuccess(true);
        setMulank("");
        setPositiveSide("");
        setPositiveSideHi("");
        setNegativeSide("");
        setNegativeSideHi("");

        setTimeout(() => setAddedSuccess(false), 2500);
      }
    });
  };

  const getData = async () => {
    if (personalityId) {
      console.log("Fetching personality by ID:", personalityId);
      const response = await dispatch(fetchPersonalityById(personalityId));
      const data = response.payload;
      if (fetchPersonalityById.fulfilled.match(response)) {
        console.log("Fetched Personality:", data);
        setMulank(data.mulank_number);
        setPositiveSide(data.positive_side);
        setPositiveSideHi(data.positive_side_hi);
        setNegativeSide(data.negative_side);
        setNegativeSideHi(data.negative_side_hi);
      } else {
        toast.error("Failed to fetch personality");
      }
    } else {
      // If no personalityId is provided, redirect to content/all
      toast.error("No personality ID provided");
      navigate("/numerology/personality/list");
    }
  };
  useEffect(() => {
    getData();
  }, [dispatch, personalityId, navigate]);

  console.log("Selected Personality:", selectedPersonality);
  useEffect(() => {
    if (selectedPersonality) {
      setMulank(selectedPersonality.mulank_number);
      setPositiveSide(selectedPersonality.positive_side);
      setPositiveSideHi(selectedPersonality.positive_side_hi);
      setNegativeSide(selectedPersonality.negative_side);
      setNegativeSideHi(selectedPersonality.negative_side_hi);
      // thumbnail and image are not set here, only on file input change
    }
  }, [selectedPersonality]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Edit3 className="h-8 w-8" />
        Edit Personality - Personality Traits
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Mulank Field */}
        <div className="mb-6">
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

        {/* Positive Side Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="positive_side"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Positive Side (English) *
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                onClick={() => {
                  setTiptapModalPositive(positiveSide);
                  setShowPositiveEditModal(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </label>
            <div
              className="min-h-[200px] p-4 border border-gray-300 rounded-md bg-green-50 overflow-auto prose max-w-none"
              dangerouslySetInnerHTML={{ __html: positiveSide }}
            />
            {formErrors.positiveSide && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.positiveSide}
              </p>
            )}
            {/* Positive Side Edit Modal Popup with Tiptap */}
            {showPositiveEditModal && (
              <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Edit Positive Side (English)
                  </h3>
                  <TiptapEditor
                    value={tiptapModalPositive}
                    onChange={setTiptapModalPositive}
                    height="200px"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => setShowPositiveEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => {
                        setPositiveSide(tiptapModalPositive);
                        setShowPositiveEditModal(false);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="positive_side_hi"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Positive Side (Hindi)
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                onClick={() => {
                  setTiptapModalPositiveHi(positiveSideHi);
                  setShowPositiveHiEditModal(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </label>
            <div
              className="min-h-[200px] p-4 border border-gray-300 rounded-md bg-green-50 overflow-auto prose max-w-none"
              dangerouslySetInnerHTML={{ __html: positiveSideHi }}
            />
            {/* Positive Side Hi Edit Modal Popup with Tiptap */}
            {showPositiveHiEditModal && (
              <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Edit Positive Side (Hindi)
                  </h3>
                  <TiptapEditor
                    value={tiptapModalPositiveHi}
                    onChange={setTiptapModalPositiveHi}
                    height="200px"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => setShowPositiveHiEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => {
                        setPositiveSideHi(tiptapModalPositiveHi);
                        setShowPositiveHiEditModal(false);
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

        {/* Negative Side Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="negative_side"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Negative Side (English) *
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                onClick={() => {
                  setTiptapModalNegative(negativeSide);
                  setShowNegativeEditModal(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </label>
            <div
              className="min-h-[200px] p-4 border border-gray-300 rounded-md bg-red-50 overflow-auto prose max-w-none"
              dangerouslySetInnerHTML={{ __html: negativeSide }}
            />
            {formErrors.negativeSide && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.negativeSide}
              </p>
            )}
            {/* Negative Side Edit Modal Popup with Tiptap */}
            {showNegativeEditModal && (
              <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Edit Negative Side (English)
                  </h3>
                  <TiptapEditor
                    value={tiptapModalNegative}
                    onChange={setTiptapModalNegative}
                    height="200px"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => setShowNegativeEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => {
                        setNegativeSide(tiptapModalNegative);
                        setShowNegativeEditModal(false);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="negative_side_hi"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Negative Side (Hindi)
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                onClick={() => {
                  setTiptapModalNegativeHi(negativeSideHi);
                  setShowNegativeHiEditModal(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </label>
            <div
              className="min-h-[200px] p-4 border border-gray-300 rounded-md bg-red-50 overflow-auto prose max-w-none"
              dangerouslySetInnerHTML={{ __html: negativeSideHi }}
            />
            {/* Negative Side Hi Edit Modal Popup with Tiptap */}
            {showNegativeHiEditModal && (
              <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Edit Negative Side (Hindi)
                  </h3>
                  <TiptapEditor
                    value={tiptapModalNegativeHi}
                    onChange={setTiptapModalNegativeHi}
                    height="200px"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => setShowNegativeHiEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => {
                        setNegativeSideHi(tiptapModalNegativeHi);
                        setShowNegativeHiEditModal(false);
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
        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            className="w-full md:w-auto px-6 py-3 rounded-md font-medium text-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-600 text-white hover:bg-red-700"
            aria-label="Delete personality"
            onClick={() => handleDeleteClick(personalityId)}
            disabled={loading || !personalityId}
          >
            Delete Personality
          </button>
        </div>
        {addedSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium text-center">
            Personality added successfully!
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

export default EditPersonality;
