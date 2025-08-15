import React, { useEffect, useState, useRef } from "react";
import TiptapEditor from "../../../components/TiptapEditor";
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
  Pencil,
} from "lucide-react";
import {
  createRashi,
  fetchRashiById,
  updateRashi,
} from "../../../store/slices/rashi";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";
import { deleteRashi } from "../../../store/slices/rashi";

const EditRashi: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedRashi, loading, error } = useSelector(
    (state: RootState) => state.content
  );
  const location = useLocation();
  const rashiId = location.state?.rashiId;
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [titleHi, setTitleHi] = useState("");
  const [content, setContent] = useState("");
  const [contentHi, setContentHi] = useState("");
  const [name, setName] = useState("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Tiptap modal states for title/content
  const [showTitleEditModal, setShowTitleEditModal] = useState(false);
  const [tiptapModalTitle, setTiptapModalTitle] = useState("");
  const [showTitleHiEditModal, setShowTitleHiEditModal] = useState(false);
  const [tiptapModalTitleHi, setTiptapModalTitleHi] = useState("");
  const [showContentEditModal, setShowContentEditModal] = useState(false);
  const [tiptapModalContent, setTiptapModalContent] = useState("");
  const [showContentHiEditModal, setShowContentHiEditModal] = useState(false);
  const [tiptapModalContentHi, setTiptapModalContentHi] = useState("");

  // Modal open/close handlers
  const handleOpenTitleEdit = () => {
    setTiptapModalTitle(title);
    setShowTitleEditModal(true);
  };
  const handleSaveTitleEdit = () => {
    setTitle(tiptapModalTitle);
    setShowTitleEditModal(false);
  };
  const handleOpenTitleHiEdit = () => {
    setTiptapModalTitleHi(titleHi);
    setShowTitleHiEditModal(true);
  };
  const handleSaveTitleHiEdit = () => {
    setTitleHi(tiptapModalTitleHi);
    setShowTitleHiEditModal(false);
  };
  const handleOpenContentEdit = () => {
    setTiptapModalContent(content);
    setShowContentEditModal(true);
  };
  const handleSaveContentEdit = () => {
    setContent(tiptapModalContent);
    setShowContentEditModal(false);
  };
  const handleOpenContentHiEdit = () => {
    setTiptapModalContentHi(contentHi);
    setShowContentHiEditModal(true);
  };
  const handleSaveContentHiEdit = () => {
    setContentHi(tiptapModalContentHi);
    setShowContentHiEditModal(false);
  };

  // Editor state
  const [activeLanguage, setActiveLanguage] = useState<"en" | "hi">("en");
  const previewMode = true;
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
        setContent(newValue);
      } else {
        setTitle(newValue);
      }
    } else {
      if (activeEditor === "content") {
        setContentHi(newValue);
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

  // DELETE: popup state and handlers for Rashi
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [rashiToDelete, setRashiToDelete] = useState<
    string | number | undefined
  >(undefined);

  // Open confirmation popup and set rashi to delete
  const handleDeleteClick = (rashiIdToDelete: string | number | undefined) => {
    if (!rashiIdToDelete) return;
    setRashiToDelete(rashiIdToDelete);
    setShowDeletePopup(true);
  };

  // Cancel delete popup
  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setRashiToDelete(undefined);
  };

  // Confirm deletion, call Rashi API, close popup, redirect to rashi list with toast
  const handleConfirmDelete = async () => {
    if (!rashiToDelete) return;
    try {
      await dispatch(deleteRashi(rashiToDelete));
      setShowDeletePopup(false);
      setRashiToDelete(undefined);
      toast.success("Rashi Deleted Successfully");

      navigate("/kundli/rashi/list", { state: { deleted: true } });
    } catch (err) {
      toast.error("Failed to delete rashi. Please try again.");
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
    if (!content.trim()) errors.content = "Content is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("short_description", title);
    formData.append("short_description_en", title);
    formData.append("short_description_hi", titleHi);
    formData.append("description", content);
    formData.append("description_en", content);
    formData.append("description_hi", contentHi);
    formData.append("name", name);

    console.log("Submitting Rashi with data:", {
      title,
      titleHi,
      content,
      contentHi,
    });
    dispatch(
      updateRashi({
        id: rashiId,
        data: {
          short_description: title,
          short_description_en: title,
          short_description_hi: titleHi,
          description: content,
          description_en: content,
          description_hi: contentHi,
          name: name,
        },
      })
    ).then((action: any) => {
      if (createRashi.fulfilled.match(action)) {
        setAddedSuccess(true);
        setTitle("");
        setTitleHi("");
        setContent("");
        setContentHi("");

        setTimeout(() => setAddedSuccess(false), 2500);
      }
    });
  };

  const getData = async () => {
    if (rashiId) {
      console.log("Fetching rashi by ID:", rashiId);
      const response = await dispatch(fetchRashiById(rashiId));
      const data = response.payload;
      if (fetchRashiById.fulfilled.match(response)) {
        console.log("Fetched Rashi:", data);
        setTitle(data.short_description || "");
        setTitleHi(data.short_description_hi || "");
        setContent(data.description || "");
        setContentHi(data.description_hi || "");
        setName(data.name || "");
      } else {
        toast.error("Failed to fetch rashi");
      }
    } else {
      // If no rashiId is provided, redirect to content/all
      toast.error("No rashi ID provided");
      navigate("/kundli/rashi/all");
    }
  };
  useEffect(() => {
    getData();
  }, [dispatch, rashiId, navigate]);

  console.log("Selected Rashi:", selectedRashi);
  useEffect(() => {
    if (selectedRashi) {
      setTitle(selectedRashi.short_description || "");
      setTitleHi(selectedRashi.short_description_hi || "");
      setContent(selectedRashi.description || "");
      setContentHi(selectedRashi.description_hi || "");
      setName(selectedRashi.name || "");
      // thumbnail and image are not set here, only on file input change
    }
  }, [selectedRashi]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Edit3 className="h-8 w-8" />
        Edit Rashi - Markdown Editor
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
        </div>

        {/* Markdown Toolbar */}
        {/* {!previewMode && (
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
        )} */}

        {/* Title Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="col-span-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name (English)
            </label>
            <select
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => {
                setActiveEditor("title");
                setActiveLanguage("en");
              }}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-required="true"
              required
              aria-describedby="title-error"
            >
              <option value="">Select Rashi</option>
              {[
                "Aries",
                "Taurus",
                "Gemini",
                "Cancer",
                "Leo",
                "Virgo",
                "Libra",
                "Scorpio",
                "Sagittarius",
                "Capricorn",
                "Aquarius",
                "Pisces",
              ].map((rashi) => (
                <option key={rashi} value={rashi}>
                  {rashi}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              Short Description (English)
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                onClick={handleOpenTitleEdit}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </label>
            {previewMode ? (
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
            {/* Title Edit Modal Popup with Tiptap */}
            {showTitleEditModal && (
              <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    Edit Short Description (English)
                  </h3>
                  <TiptapEditor
                    value={tiptapModalTitle}
                    onChange={setTiptapModalTitle}
                    height="80px"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => setShowTitleEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                      onClick={handleSaveTitleEdit}
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
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              Short Description (Hindi)
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                onClick={handleOpenTitleHiEdit}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </label>
            {previewMode ? (
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
            {/* Title Hi Edit Modal Popup with Tiptap */}
            {showTitleHiEditModal && (
              <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    Edit Short Description (Hindi)
                  </h3>
                  <TiptapEditor
                    value={tiptapModalTitleHi}
                    onChange={setTiptapModalTitleHi}
                    height="80px"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => setShowTitleHiEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                      onClick={handleSaveTitleHiEdit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              Content (English)
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                onClick={handleOpenContentEdit}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </label>
            {previewMode ? (
              <div
                className="h-[300px] p-4 border border-gray-300 rounded-md bg-gray-50 overflow-auto prose max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            ) : (
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => {
                  setActiveEditor("content");
                  setActiveLanguage("en");
                }}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm"
                rows={15}
                aria-required="true"
                aria-describedby="content-error"
                placeholder="Enter your markdown content here..."
              />
            )}
            {formErrors.content && (
              <p id="content-error" className="mt-1 text-sm text-red-600">
                {formErrors.content}
              </p>
            )}
            {/* Content Edit Modal Popup with Tiptap */}
            {showContentEditModal && (
              <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    Edit Content (English)
                  </h3>
                  <TiptapEditor
                    value={tiptapModalContent}
                    onChange={setTiptapModalContent}
                    height="300px"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => setShowContentEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                      onClick={handleSaveContentEdit}
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
              htmlFor="content_hi"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              Content (Hindi)
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                onClick={handleOpenContentHiEdit}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </label>
            {previewMode ? (
              <div
                className="h-[300px] p-4 border border-gray-300 rounded-md bg-gray-50 overflow-auto prose max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(contentHi) }}
              />
            ) : (
              <textarea
                id="content_hi"
                value={contentHi}
                onChange={(e) => setContentHi(e.target.value)}
                onFocus={() => {
                  setActiveEditor("content");
                  setActiveLanguage("hi");
                }}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm"
                rows={15}
                placeholder="यहाँ अपना मार्कडाउन कंटेंट लिखें..."
              />
            )}
            {/* Content Hi Edit Modal Popup with Tiptap */}
            {showContentHiEditModal && (
              <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    Edit Content (Hindi)
                  </h3>
                  <TiptapEditor
                    value={tiptapModalContentHi}
                    onChange={setTiptapModalContentHi}
                    height="150px"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => setShowContentHiEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                      onClick={handleSaveContentHiEdit}
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
            aria-label="Add article"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Article"}
          </button>
          <button
            type="button"
            className="w-full md:w-auto px-6 py-3 rounded-md font-medium text-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-600 text-white hover:bg-red-700"
            aria-label="Delete article"
            onClick={() => handleDeleteClick(rashiId)}
            disabled={loading || !rashiId}
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

export default EditRashi;
