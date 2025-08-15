import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Crown, CheckCircle, XCircle, Pencil } from "lucide-react";
import TiptapEditor from "../../../../components/TiptapEditor";
import { RootState } from "../../../../store";
import {
  createRajyog,
  fetchRajyogById,
  updateRajyog,
  deleteRajyog,
} from "../../../../store/slices/rajyogSlice";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";

const EditRajyog: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedRajyog, loading, error } = useSelector(
    (state: RootState) => state.rajyog
  ); // Updated selector

  // Form state for Rajyog fields
  const [yog, setYog] = useState("");
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [titleHi, setTitleHi] = useState("");

  const location = useLocation();
  const rajyogId = location.state?.rajyogId;
  const navigate = useNavigate();
  // Present description fields
  const [presentDescription, setPresentDescription] = useState("");
  const [presentDescriptionEn, setPresentDescriptionEn] = useState("");
  const [presentDescriptionHi, setPresentDescriptionHi] = useState("");

  // Missing description fields
  const [missingDescription, setMissingDescription] = useState("");
  const [missingDescriptionEn, setMissingDescriptionEn] = useState("");
  const [missingDescriptionHi, setMissingDescriptionHi] = useState("");

  const [isRajyog, setIsRajyog] = useState(false);

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Preview mode state
  const [previewMode, setPreviewMode] = useState(true);

  // Modal states for editing descriptions
  const [showPresentEnEditModal, setShowPresentEnEditModal] = useState(false);
  const [showPresentHiEditModal, setShowPresentHiEditModal] = useState(false);
  const [showMissingEnEditModal, setShowMissingEnEditModal] = useState(false);
  const [showMissingHiEditModal, setShowMissingHiEditModal] = useState(false);

  // Modal temp values
  const [modalPresentEn, setModalPresentEn] = useState("");
  const [modalPresentHi, setModalPresentHi] = useState("");
  const [modalMissingEn, setModalMissingEn] = useState("");
  const [modalMissingHi, setModalMissingHi] = useState("");

  // Modal open/close handlers
  const handleOpenPresentEnEdit = () => {
    setModalPresentEn(presentDescriptionEn);
    setShowPresentEnEditModal(true);
  };
  const handleSavePresentEnEdit = () => {
    setPresentDescriptionEn(modalPresentEn);
    setShowPresentEnEditModal(false);
  };
  const handleOpenPresentHiEdit = () => {
    setModalPresentHi(presentDescriptionHi);
    setShowPresentHiEditModal(true);
  };
  const handleSavePresentHiEdit = () => {
    setPresentDescriptionHi(modalPresentHi);
    setShowPresentHiEditModal(false);
  };
  const handleOpenMissingEnEdit = () => {
    setModalMissingEn(missingDescriptionEn);
    setShowMissingEnEditModal(true);
  };
  const handleSaveMissingEnEdit = () => {
    setMissingDescriptionEn(modalMissingEn);
    setShowMissingEnEditModal(false);
  };
  const handleOpenMissingHiEdit = () => {
    setModalMissingHi(missingDescriptionHi);
    setShowMissingHiEditModal(true);
  };
  const handleSaveMissingHiEdit = () => {
    setMissingDescriptionHi(modalMissingHi);
    setShowMissingHiEditModal(false);
  };

  // Simple markdown renderer for preview
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
      .replace(
        /\[([^\]]+)\]\(([^\)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      .replace(
        /!\[([^\]]*)\]\(([^\)]+)\)/g,
        '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />'
      )
      .replace(/\n/g, "<br>");
  };

  // DELETE: popup state and handlers
  // DELETE: popup state and handlers for Rajyog
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [rajyogToDelete, setRajyogToDelete] = useState<
    string | number | undefined
  >(undefined);

  // Open confirmation popup and set rajyog to delete
  const handleDeleteClick = (rajyogIdToDelete: string | number | undefined) => {
    if (!rajyogIdToDelete) return;
    setRajyogToDelete(rajyogIdToDelete);
    setShowDeletePopup(true);
  };

  // Cancel delete popup
  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setRajyogToDelete(undefined);
  };

  // Confirm deletion, call Rajyog API, close popup, redirect to rajyog list with toast
  const handleConfirmDelete = async () => {
    if (!rajyogToDelete) return;
    try {
      await dispatch(deleteRajyog(rajyogToDelete));
      setShowDeletePopup(false);
      setRajyogToDelete(undefined);
      toast.success("Rajyog Deleted Successfully");
      navigate("/numerology/rajyogs/list", { state: { deleted: true } });
    } catch (err) {
      toast.error("Failed to delete rajyog. Please try again.");
    }
  };

  // ...existing code...

  // Validate form
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!yog.trim()) errors.yog = "Yog number is required";
    if (!titleEn.trim()) errors.titleEn = "English title is required";
    if (!presentDescriptionEn.trim())
      errors.presentDescriptionEn = "Present description (English) is required";
    if (!missingDescriptionEn.trim())
      errors.missingDescriptionEn = "Missing description (English) is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Submitting Rajyog with data:", {
      yog,
      title,
      titleEn,
      titleHi,
      presentDescription,
      presentDescriptionEn,
      presentDescriptionHi,
      missingDescription,
      missingDescriptionEn,
      missingDescriptionHi,
      isRajyog,
    });

    dispatch(
      updateRajyog({
        id: rajyogId,
        data: {
          yog,
          title,
          title_en: titleEn,
          title_hi: titleHi,
          present_description: presentDescription || presentDescriptionEn,
          present_description_en: presentDescriptionEn,
          present_description_hi: presentDescriptionHi,
          missing_description: missingDescription || missingDescriptionEn,
          missing_description_en: missingDescriptionEn,
          missing_description_hi: missingDescriptionHi,
          is_rajyog: isRajyog,
        },
      })
    ).then((action: any) => {
      if (createRajyog.fulfilled.match(action)) {
        setAddedSuccess(true);

        // Reset form
        setYog("");
        setTitle("");
        setTitleEn("");
        setTitleHi("");
        setPresentDescription("");
        setPresentDescriptionEn("");
        setPresentDescriptionHi("");
        setMissingDescription("");
        setMissingDescriptionEn("");
        setMissingDescriptionHi("");
        setIsRajyog(false);

        setTimeout(() => setAddedSuccess(false), 2500);
      }
    });
  };

  const getData = async () => {
    if (rajyogId) {
      console.log("Fetching rajyog by ID:", rajyogId);
      const response = await dispatch(fetchRajyogById(rajyogId));
      const data = response.payload;
      if (fetchRajyogById.fulfilled.match(response)) {
        console.log("Fetched Rajyog:", data);
        setYog(data.yog);
        setTitle(data.title);
        setTitleEn(data.title_en);
        setTitleHi(data.title_hi);
        setPresentDescriptionEn(data.present_description_en);
        setPresentDescriptionHi(data.present_description_hi);
        setMissingDescriptionEn(data.missing_description_en);
        setMissingDescriptionHi(data.missing_description_hi);
        setIsRajyog(data.is_rajyog);
      } else {
        toast.error("Failed to fetch rajyog");
      }
    } else {
      // If no personalityId is provided, redirect to content/all
      toast.error("No personality ID provided");
      navigate("/numerology/personality/list");
    }
  };
  useEffect(() => {
    getData();
  }, [dispatch, rajyogId, navigate]);

  console.log("Selected Rajyog:", selectedRajyog);
  useEffect(() => {
    if (selectedRajyog) {
      setYog(selectedRajyog.yog);
      setTitle(selectedRajyog.title);
      setTitleEn(selectedRajyog.title_en);
      setTitleHi(selectedRajyog.title_hi);
      setPresentDescriptionEn(selectedRajyog.present_description_en);
      setPresentDescriptionHi(selectedRajyog.present_description_hi);
      setMissingDescriptionEn(selectedRajyog.missing_description_en);
      setMissingDescriptionHi(selectedRajyog.missing_description_hi);
      setIsRajyog(selectedRajyog.is_rajyog);

      // thumbnail and image are not set here, only on file input change
    }
  }, [selectedRajyog]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Crown className="h-8 w-8 text-yellow-600" />
        Edit Rajyog - {titleEn} - {yog}
      </h2>

      <div className="flex justify-end mb-4">
        <button
          type="button"
          className={`px-4 py-2 rounded-md font-medium ${
            previewMode
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-600 text-white hover:bg-gray-700"
          }`}
          onClick={() => setPreviewMode(!previewMode)}
        >
          {previewMode ? "Edit" : "Preview"}
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Crown className="h-6 w-6 text-yellow-600" />
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Yog Number */}
            <div>
              <label
                htmlFor="yog"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Yog Number*
              </label>
              <input
                id="yog"
                type="text"
                value={yog}
                onChange={(e) => setYog(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 123"
              />
              {formErrors.yog && (
                <p className="mt-1 text-sm text-red-600">{formErrors.yog}</p>
              )}
            </div>

            {/* Is Rajyog Checkbox */}
            <div className="flex items-center">
              <input
                id="is_rajyog"
                type="checkbox"
                checked={isRajyog}
                onChange={(e) => setIsRajyog(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="is_rajyog"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                Is this a Rajyog?
              </label>
            </div>
          </div>

          {/* Title Fields */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
            {/* <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title (General)
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="General title"
              />
            </div> */}

            <div>
              <label
                htmlFor="title_en"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title (English)*
              </label>
              <input
                id="title_en"
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="English title"
              />
              {formErrors.titleEn && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.titleEn}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="title_hi"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title (Hindi)
              </label>
              <input
                id="title_hi"
                type="text"
                value={titleHi}
                onChange={(e) => setTitleHi(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="हिंदी शीर्षक"
              />
            </div>
          </div>
        </div>

        {/* Present Description Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Present Description
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Describe what happens when this yoga is present in the grid
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="present_description_en"
                className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2"
              >
                Present Description (English) *
                <button
                  type="button"
                  className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                  onClick={handleOpenPresentEnEdit}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </label>
              {previewMode ? (
                <div
                  className="min-h-[200px] p-4 border border-gray-300 rounded-md bg-green-50 overflow-auto prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(presentDescriptionEn),
                  }}
                />
              ) : (
                <textarea
                  id="present_description_en"
                  value={presentDescriptionEn}
                  onChange={(e) => setPresentDescriptionEn(e.target.value)}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm bg-green-50"
                  rows={10}
                  placeholder="Describe what happens when this yoga is present..."
                />
              )}
              {/* Present English Edit Modal Popup */}
              {showPresentEnEditModal && (
                <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Edit Present Description (English)
                    </h3>

                    <TiptapEditor
                      value={modalPresentEn}
                      onChange={setModalPresentEn}
                      height="200px"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={() => setShowPresentEnEditModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        onClick={handleSavePresentEnEdit}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {formErrors.presentDescriptionEn && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.presentDescriptionEn}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="present_description_hi"
                className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2"
              >
                Present Description (Hindi)
                <button
                  type="button"
                  className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                  onClick={handleOpenPresentHiEdit}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </label>
              {previewMode ? (
                <div
                  className="min-h-[200px] p-4 border border-gray-300 rounded-md bg-green-50 overflow-auto prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(presentDescriptionHi),
                  }}
                />
              ) : (
                <textarea
                  id="present_description_hi"
                  value={presentDescriptionHi}
                  onChange={(e) => setPresentDescriptionHi(e.target.value)}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm bg-green-50"
                  rows={10}
                  placeholder="जब यह योग उपस्थित हो तो क्या होता है, इसका वर्णन करें..."
                />
              )}
              {/* Present Hindi Edit Modal Popup */}
              {showPresentHiEditModal && (
                <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Edit Present Description (Hindi)
                    </h3>

                    <TiptapEditor
                      value={modalPresentHi}
                      onChange={setModalPresentHi}
                      height="200px"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={() => setShowPresentHiEditModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        onClick={handleSavePresentHiEdit}
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

        {/* Missing Description Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <XCircle className="h-6 w-6 text-red-600" />
            Missing Description
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Describe what happens when this yoga is missing from the grid
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="missing_description_en"
                className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2"
              >
                Missing Description (English) *
                <button
                  type="button"
                  className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                  onClick={handleOpenMissingEnEdit}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </label>
              {previewMode ? (
                <div
                  className="min-h-[200px] p-4 border border-gray-300 rounded-md bg-red-50 overflow-auto prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(missingDescriptionEn),
                  }}
                />
              ) : (
                <textarea
                  id="missing_description_en"
                  value={missingDescriptionEn}
                  onChange={(e) => setMissingDescriptionEn(e.target.value)}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm bg-red-50"
                  rows={10}
                  placeholder="Describe what happens when this yoga is missing..."
                />
              )}
              {/* Missing English Edit Modal Popup */}
              {showMissingEnEditModal && (
                <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Edit Missing Description (English)
                    </h3>

                    <TiptapEditor
                      value={modalMissingEn}
                      onChange={setModalMissingEn}
                      height="200px"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={() => setShowMissingEnEditModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        onClick={handleSaveMissingEnEdit}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {formErrors.missingDescriptionEn && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.missingDescriptionEn}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="missing_description_hi"
                className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2"
              >
                Missing Description (Hindi)
                <button
                  type="button"
                  className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                  onClick={handleOpenMissingHiEdit}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </label>
              {previewMode ? (
                <div
                  className="min-h-[200px] p-4 border border-gray-300 rounded-md bg-red-50 overflow-auto prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(missingDescriptionHi),
                  }}
                />
              ) : (
                <textarea
                  id="missing_description_hi"
                  value={missingDescriptionHi}
                  onChange={(e) => setMissingDescriptionHi(e.target.value)}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm bg-red-50"
                  rows={10}
                  placeholder="जब यह योग अनुपस्थित हो तो क्या होता है, इसका वर्णन करें..."
                />
              )}
              {/* Missing Hindi Edit Modal Popup */}
              {showMissingHiEditModal && (
                <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Edit Missing Description (Hindi)
                    </h3>

                    <TiptapEditor
                      value={modalMissingHi}
                      onChange={setModalMissingHi}
                      height="200px"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={() => setShowMissingHiEditModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        onClick={handleSaveMissingHiEdit}
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
            className="w-full md:w-auto px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 font-medium text-lg flex items-center gap-2"
            disabled={loading}
          >
            <Crown className="h-5 w-5" />
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            className="w-full md:w-auto px-6 py-3 rounded-md font-medium text-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-600 text-white hover:bg-red-700"
            aria-label="Delete article"
            onClick={() => handleDeleteClick(rajyogId)}
            disabled={loading || !rajyogId}
          >
            Delete Article
          </button>
        </div>

        {addedSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium text-center">
            Rajyog updated successfully!
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

export default EditRajyog;
