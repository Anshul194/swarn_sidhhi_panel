import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Edit3, Pencil } from "lucide-react";
import {
  fetchEntranceById,
  updateEntrance,
  deleteEntrance,
} from "../../../../store/slices/vastuEntranceAnalysisSlice";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";
import { RootState } from "../../../../store";
// Make sure the path is correct; update if needed, for example:
import TiptapEditor from "../../../../components/TiptapEditor";
// Or, if the file does not exist, create it at the specified path.

const EditVastuEntrance: React.FC = () => {
  const dispatch = useDispatch();

  // Form state
  const [title, setTitle] = useState("");
  const [titleHi, setTitleHi] = useState("");

  const [name, setName] = useState("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [addedSuccess, setAddedSuccess] = useState(false);
  const location = useLocation();

  const entranceId = location.state?.entranceId;
  const { selectedEntrance, loading, error } = useSelector(
    (state: RootState) => state.vastuEntrance
  );
  const navigate = useNavigate();
  // Editor state
  const [activeLanguage, setActiveLanguage] = useState<"en" | "hi">("en");
  const [previewMode, setPreviewMode] = useState(false);
  const [activeEditor, setActiveEditor] = useState<"content" | "title">(
    "content"
  );

  // Popup state for editing title and titleHi
  const [showTitleEditModal, setShowTitleEditModal] = useState(false);
  const [showTitleHiEditModal, setShowTitleHiEditModal] = useState(false);
  const [tiptapModalTitle, setTiptapModalTitle] = useState("");
  const [tiptapModalTitleHi, setTiptapModalTitleHi] = useState("");

  // DELETE: popup state and handlers
  // DELETE: popup state and handlers for Entrance
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [entranceToDelete, setEntranceToDelete] = useState<
    string | number | undefined
  >(undefined);

  // Open confirmation popup and set entrance to delete
  const handleDeleteClick = (
    entranceIdToDelete: string | number | undefined
  ) => {
    if (!entranceIdToDelete) return;
    setEntranceToDelete(entranceIdToDelete);
    setShowDeletePopup(true);
  };

  // Cancel delete popup
  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setEntranceToDelete(undefined);
  };

  // Confirm deletion, call Entrance API, close popup, redirect to entrance list with toast
  const handleConfirmDelete = async () => {
    if (!entranceToDelete) return;
    try {
      await dispatch(deleteEntrance(entranceToDelete));
      setShowDeletePopup(false);
      setEntranceToDelete(undefined);
      toast.success("Entrance Deleted Successfully");
      navigate("/vastu/entrance/analysis/list", { state: { deleted: true } });
    } catch (err) {
      toast.error("Failed to delete entrance. Please try again.");
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!title.trim()) errors.title = "Title is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Submitting Rashi with data:", {
      title,
      titleHi,
    });
    dispatch(
      updateEntrance({
        id: entranceId,
        data: {
          meaning: title,
          meaning_en: title,
          meaning_hi: titleHi,
          entry: name,
        },
      })
    ).then((action: any) => {
      if (updateEntrance.fulfilled.match(action)) {
        setAddedSuccess(true);
        setTitle("");
        setTitleHi("");
        setName("");
        setTimeout(() => setAddedSuccess(false), 2500);
      }
    });
  };

  const getData = async () => {
    if (entranceId) {
      console.log("Fetching entrance by ID:", entranceId);
      const response = await dispatch(fetchEntranceById(entranceId));
      const data = response.payload;
      if (fetchEntranceById.fulfilled.match(response)) {
        console.log("Fetched Rashi:", data);
        setTitle(data.meaning || "");
        setTitleHi(data.meaning_hi || "");
        setName(data.entry || "");
      } else {
        toast.error("Failed to fetch entrance");
      }
    } else {
      // If no entranceId is provided, redirect to content/all
      toast.error("No Vastu Entrance ID provided");
      navigate("/vastu/entrance/analysis/list");
    }
  };
  useEffect(() => {
    getData();
  }, [dispatch, entranceId]);

  console.log("Selected Entrance:", selectedEntrance);
  useEffect(() => {
    if (selectedEntrance) {
      setTitle(selectedEntrance.meaning || "");
      setTitleHi(selectedEntrance.meaning_hi || "");
      setName(selectedEntrance.entry || "");
      // thumbnail and image are not set here, only on file input change
    }
  }, [selectedEntrance]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Edit3 className="h-8 w-8" />
        Edit vastu Entrance
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Title Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="col-span-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Entry (English){" "}
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => {
                setActiveEditor("title");
                setActiveLanguage("en");
              }}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-required="true"
              aria-describedby="title-error"
            />
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Meaning (English)
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                onClick={() => {
                  setTiptapModalTitle(title);
                  setShowTitleEditModal(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </label>
            <div
              className="h-[200px] p-2 border border-gray-300 rounded-md bg-gray-50"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            {formErrors.title && (
              <p id="title-error" className="mt-1 text-sm text-red-600">
                {formErrors.title}
              </p>
            )}
            {/* Title Edit Modal Popup with Tiptap */}
            {showTitleEditModal && (
              <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Edit Meaning (English)
                  </h3>
                  <TiptapEditor
                    value={tiptapModalTitle}
                    onChange={setTiptapModalTitle}
                    height="300px"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => setShowTitleEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => {
                        setTitle(tiptapModalTitle);
                        setShowTitleEditModal(false);
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
              htmlFor="title_hi"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Meaning (Hindi)
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                onClick={() => {
                  setTiptapModalTitleHi(titleHi);
                  setShowTitleHiEditModal(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </label>
            <div
              className="h-[200px]  p-2 border border-gray-300 rounded-md bg-gray-50"
              dangerouslySetInnerHTML={{ __html: titleHi }}
            />
            {/* Title Hi Edit Modal Popup with Tiptap */}
            {showTitleHiEditModal && (
              <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Edit Meaning (Hindi)
                  </h3>
                  <TiptapEditor
                    value={tiptapModalTitleHi}
                    onChange={setTiptapModalTitleHi}
                    height="300px"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => setShowTitleHiEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => {
                        setTitleHi(tiptapModalTitleHi);
                        setShowTitleHiEditModal(false);
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
            aria-label="Add entrance"
            disabled={loading}
          >
            {loading ? "updating..." : "Update"}
          </button>
          <button
            type="button"
            className="w-full md:w-auto px-6 py-3 rounded-md font-medium text-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-600 text-white hover:bg-red-700"
            aria-label="Delete entrance"
            onClick={() => handleDeleteClick(entranceId)}
            disabled={loading || !entranceId}
          >
            Delete Entrance
          </button>
        </div>
        {addedSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium text-center">
            vastu Entrance added successfully!
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

export default EditVastuEntrance;
