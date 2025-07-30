import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Image,
  Code,
  Quote,
  Eye,
  Edit3,
  FileText,
  Languages,
} from "lucide-react";
import {
  createEntrance,
  fetchEntranceById,
  updateEntrance,
  deleteEntrance,
} from "../../../../store/slices/vastuEntranceAnalysisSlice";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";
import { RootState } from "../../../../store";

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

  // Markdown helper functions
  const insertMarkdown = (
    before: string,
    after: string = "",
    placeholder: string = ""
  ) => {
    const textarea = document.getElementById(
      activeLanguage === "en"
        ? activeEditor === "content"
          ? "content"
          : "title"
        : activeEditor === "content"
        ? "content_hi"
        : "title_hi"
    ) as HTMLTextAreaElement;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    const newText = before + textToInsert + after;

    const currentValue = textarea.value;
    const newValue =
      currentValue.substring(0, start) + newText + currentValue.substring(end);

    // Update the appropriate state
    if (activeLanguage === "en") {
      if (activeEditor === "content") {
        // setContent(newValue);
      } else {
        setTitle(newValue);
      }
    } else {
      if (activeEditor === "content") {
        // setContentHi(newValue);
      } else {
        setTitleHi(newValue);
      }
    }

    // Set cursor position
    setTimeout(() => {
      const newStart = start + before.length;
      const newEnd = newStart + textToInsert.length;
      textarea.setSelectionRange(newStart, newEnd);
      textarea.focus();
    }, 0);
  };

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

  const markdownButtons = [
    {
      icon: Bold,
      label: "Bold",
      action: () => insertMarkdown("**", "**", "bold text"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertMarkdown("_", "_", "italic text"),
    },
    {
      icon: List,
      label: "Bullet List",
      action: () => insertMarkdown("- ", "", "list item"),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertMarkdown("1. ", "", "list item"),
    },
    {
      icon: Link2,
      label: "Link",
      action: () => insertMarkdown("[", "](url)", "link text"),
    },
    {
      icon: Image,
      label: "Image",
      action: () => insertMarkdown("![", "](image-url)", "alt text"),
    },
    {
      icon: Code,
      label: "Code",
      action: () => insertMarkdown("`", "`", "code"),
    },
    {
      icon: Quote,
      label: "Quote",
      action: () => insertMarkdown("> ", "", "quote text"),
    },
  ];

  // Render markdown as HTML (simple implementation)
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/^(\d+)\. (.*$)/gim, "<li>$1. $2</li>")
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
      // If no rashiId is provided, redirect to content/all
      toast.error("No rashi ID provided");
      navigate("/kundli/rashi/all");
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
        Edit vastu Entrance - Markdown Editor
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Language and Editor Controls */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-blue-600" />
            <label className="text-sm font-medium text-gray-700">
              Language:
            </label>
            <select
              value={activeLanguage}
              onChange={(e) => setActiveLanguage(e.target.value as "en" | "hi")}
              className="px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <label className="text-sm font-medium text-gray-700">Editor:</label>
            <select
              value={activeEditor}
              onChange={(e) =>
                setActiveEditor(e.target.value as "content" | "title")
              }
              className="px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="title">Short Des</option>
              <option value="content">Description</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
              previewMode
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            {previewMode ? (
              <Edit3 className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {previewMode ? "Edit" : "Preview"}
          </button>
        </div>

        {/* Markdown Toolbar */}
        {!previewMode && (
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-100 rounded-lg">
            {markdownButtons.map((button, index) => (
              <button
                key={index}
                type="button"
                onClick={button.action}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                title={button.label}
              >
                <button.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{button.label}</span>
              </button>
            ))}
          </div>
        )}

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
              Meaning (English){" "}
              {activeLanguage === "en" && activeEditor === "title" && (
                <span className="text-blue-600 text-xs">← Active</span>
              )}
            </label>
            {previewMode &&
            activeLanguage === "en" &&
            activeEditor === "title" ? (
              <div
                className="min-h-[2.5rem] p-2 border border-gray-300 rounded-md bg-gray-50"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(title) }}
              />
            ) : (
              <textarea
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => {
                  setActiveEditor("title");
                  setActiveLanguage("en");
                }}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm"
                rows={6}
                aria-required="true"
                aria-describedby="content-error"
                placeholder="Enter your markdown content here..."
              />
            )}
            {formErrors.title && (
              <p id="title-error" className="mt-1 text-sm text-red-600">
                {formErrors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="title_hi"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Meaning (Hindi){" "}
              {activeLanguage === "hi" && activeEditor === "title" && (
                <span className="text-blue-600 text-xs">← Active</span>
              )}
            </label>
            {previewMode &&
            activeLanguage === "hi" &&
            activeEditor === "title" ? (
              <div
                className="min-h-[2.5rem] p-2 border border-gray-300 rounded-md bg-gray-50"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(titleHi) }}
              />
            ) : (
              <textarea
                id="title_hi"
                value={titleHi}
                onChange={(e) => setTitleHi(e.target.value)}
                onFocus={() => {
                  setActiveEditor("title");
                  setActiveLanguage("hi");
                }}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm"
                rows={6}
                aria-required="true"
                aria-describedby="content-error"
                placeholder="Enter your markdown content here..."
              />
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg"
            aria-label="Add article"
            disabled={loading}
          >
            {loading ? "updating..." : "Update"}
          </button>
          <button
            type="button"
            className="w-full md:w-auto px-6 py-3 rounded-md font-medium text-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-600 text-white hover:bg-red-700"
            aria-label="Delete article"
            onClick={() => handleDeleteClick(entranceId)}
            disabled={loading || !entranceId}
          >
            Delete Article
          </button>
        </div>
        {addedSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium text-center">
            Article added successfully!
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
