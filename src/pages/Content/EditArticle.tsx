import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchArticleById, updateArticle } from "../../store/slices/content";
import { RootState } from "../../store/store";
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
import { fetchTags } from "../../store/slices/tag";

const EditArticle: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const articleId = location.state?.articleId;
  const dispatch = useDispatch();
  const { selectedArticle, loading, error } = useSelector(
    (state: RootState) => state.content
  );

  // Form state
  const [title, setTitle] = useState("");
  const [titleHi, setTitleHi] = useState("");
  const [content, setContent] = useState("");
  const [contentHi, setContentHi] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [articleLoaded, setArticleLoaded] = useState(false);

  const { tags: fetchedTags } = useSelector((state: any) => state?.tag);

  // Editor state
  const [activeLanguage, setActiveLanguage] = useState<"en" | "hi">("en");
  const [previewMode, setPreviewMode] = useState(false);
  const [activeEditor, setActiveEditor] = useState<"content" | "title">(
    "content"
  );
  useEffect(() => {
    // Fetch tags when component mounts
    if (!fetchedTags.length || fetchTags.length === 0) {
      dispatch(fetchTags());
    }
  }, [dispatch]);

  // Fetch article when component mounts
  useEffect(() => {
    if (articleId) {
      const token = localStorage.getItem("token") || "";
      const baseUrl = import.meta.env.VITE_BASE_URL || "";
      dispatch(fetchArticleById({ token, baseUrl, articleId }));
    } else {
      // If no articleId is provided, redirect to content/all
      toast.error("No article ID provided");
      navigate("/content/all");
    }
  }, [dispatch, articleId, navigate]);

  // Populate form fields when selectedArticle changes
  useEffect(() => {
    if (selectedArticle) {
      setTitle(selectedArticle.title || "");
      setTitleHi(selectedArticle.title_hi || "");
      setContent(selectedArticle.content || "");
      setContentHi(selectedArticle.content_hi || "");
      setCategory(selectedArticle.category || "");
      setTags(selectedArticle.tags?.join(", ") || "");
      setArticleLoaded(true);
      // thumbnail and image are not set here, only on file input change
    }
  }, [selectedArticle]);

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
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<
    string | number | undefined
  >(undefined);

  // Open confirmation popup and set article to delete
  const handleDeleteClick = (
    articleIdToDelete: string | number | undefined
  ) => {
    if (!articleIdToDelete) return;
    setArticleToDelete(articleIdToDelete);
    setShowDeletePopup(true);
  };

  // Cancel delete popup
  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setArticleToDelete(undefined);
  };

  // Confirm deletion, call API, close popup, redirect to list with toast
  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    try {
      const token = localStorage.getItem("token") || "";
      const baseUrl = import.meta.env.VITE_BASE_URL || "";
      const { deleteArticle } = await import("../../store/slices/content");
      await dispatch(
        deleteArticle({
          token,
          baseUrl,
          articleId: articleToDelete,
        })
      );
      setShowDeletePopup(false);
      setArticleToDelete(undefined);
      toast.success("Article Deleted Successfully");
      navigate("/content/all", { state: { deleted: true } });
    } catch (err) {
      toast.error("Failed to delete article. Please try again.");
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
    if (!category.trim()) errors.category = "Category is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!articleId) {
      toast.error("Article ID not found");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("title_hi", titleHi);
      formData.append("content", content);
      formData.append("content_hi", contentHi);
      formData.append("category", category);
      formData.append("tags", tags);
      if (thumbnail) formData.append("thumbnail", thumbnail);
      if (image) formData.append("image", image);

      const token = localStorage.getItem("token") || "";
      const baseUrl = import.meta.env.VITE_BASE_URL || "";

      const resultAction = await dispatch(
        updateArticle({ token, baseUrl, articleId, formData })
      );

      // Check if the update was successful
      if (updateArticle.fulfilled.match(resultAction)) {
        setUpdateSuccess(true);
        toast.success("Article updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Navigate after showing success message
        setTimeout(() => {
          navigate("/content/all");
        }, 2000);
      } else {
        toast.error(
          resultAction.payload?.message ||
            "Failed to update article. Please try again.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file input changes
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg">Loading article...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !updateSuccess) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading article
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => navigate("/content/all")}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Go back to articles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - show success message while navigating
  if (updateSuccess) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg shadow-md p-6 flex items-center">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Article Updated Successfully!
              </h3>
              <p className="text-green-700 text-base mb-2">
                Your article has been updated successfully. Redirecting to
                articles list...
              </p>
              <span className="text-sm text-green-600 flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Redirecting...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No article selected state (only show if article hasn't been loaded and we're not in success state)
  if (!selectedArticle && !loading && !articleLoaded && !updateSuccess) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                No article selected
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Please select an article to edit from the articles list.</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => navigate("/content/all")}
                  className="bg-yellow-100 px-3 py-2 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-200"
                >
                  Go to articles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Edit3 className="h-8 w-8" />
        Edit Article - Markdown Editor
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Read-only fields */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Article Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Article ID
              </label>
              <input
                type="text"
                value={selectedArticle?.id || ""}
                readOnly
                className="mt-1 block w-full p-2 border border-gray-300 bg-gray-100 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                View Count
              </label>
              <input
                type="number"
                value={selectedArticle?.view_count || 0}
                readOnly
                className="mt-1 block w-full p-2 border border-gray-300 bg-gray-100 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Share Count
              </label>
              <input
                type="number"
                value={selectedArticle?.share_count || 0}
                readOnly
                className="mt-1 block w-full p-2 border border-gray-300 bg-gray-100 rounded-md text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expert
              </label>
              <input
                type="text"
                value={
                  selectedArticle?.expert
                    ? `${selectedArticle.expert.name} (${selectedArticle.expert.email})`
                    : ""
                }
                readOnly
                className="mt-1 block w-full p-2 border border-gray-300 bg-gray-100 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Published At
              </label>
              <input
                type="text"
                value={selectedArticle?.published_at || ""}
                readOnly
                className="mt-1 block w-full p-2 border border-gray-300 bg-gray-100 rounded-md text-sm"
              />
            </div>
          </div>
        </div>

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
              <option value="title">Title</option>
              <option value="content">Content</option>
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
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title (English){" "}
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
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => {
                  setActiveEditor("title");
                  setActiveLanguage("en");
                }}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                aria-required="true"
                aria-describedby="title-error"
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
              Title (Hindi){" "}
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
              <input
                id="title_hi"
                type="text"
                value={titleHi}
                onChange={(e) => setTitleHi(e.target.value)}
                onFocus={() => {
                  setActiveEditor("title");
                  setActiveLanguage("hi");
                }}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>
        </div>

        {/* Content Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content (English){" "}
              {activeLanguage === "en" && activeEditor === "content" && (
                <span className="text-blue-600 text-xs">← Active</span>
              )}
            </label>
            {previewMode &&
            activeLanguage === "en" &&
            activeEditor === "content" ? (
              <div
                className="min-h-[300px] p-4 border border-gray-300 rounded-md bg-gray-50 overflow-auto prose max-w-none"
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
          </div>

          <div>
            <label
              htmlFor="content_hi"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content (Hindi){" "}
              {activeLanguage === "hi" && activeEditor === "content" && (
                <span className="text-blue-600 text-xs">← Active</span>
              )}
            </label>
            {previewMode &&
            activeLanguage === "hi" &&
            activeEditor === "content" ? (
              <div
                className="min-h-[300px] p-4 border border-gray-300 rounded-md bg-gray-50 overflow-auto prose max-w-none"
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
          </div>
        </div>

        {/* Other fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category:
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-required="true"
              aria-describedby="category-error"
            />
            {formErrors.category && (
              <p id="category-error" className="mt-1 text-sm text-red-600">
                {formErrors.category}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700"
            >
              Tags (comma-separated):
            </label>
            <select
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select tags</option>
              {fetchedTags?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* File uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium text-gray-700"
            >
              Thumbnail:
            </label>
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setThumbnail)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {selectedArticle?.thumbnail && (
              <p className="mt-1 text-sm">
                Current:{" "}
                <a
                  href={selectedArticle.thumbnail}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Thumbnail
                </a>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image:
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setImage)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {selectedArticle?.image && (
              <p className="mt-1 text-sm">
                Current:{" "}
                <a
                  href={selectedArticle.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Image
                </a>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto px-6 py-3 rounded-md font-medium text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isSubmitting
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            aria-label="Update article"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                Updating...
              </span>
            ) : (
              "Update Article"
            )}
          </button>
          {/* DELETE: delete button beside update */}
          <button
            type="button"
            className="w-full md:w-auto px-6 py-3 rounded-md font-medium text-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-600 text-white hover:bg-red-700"
            aria-label="Delete article"
            onClick={() => handleDeleteClick(selectedArticle?.id)}
            disabled={isSubmitting || !selectedArticle?.id}
          >
            Delete Article
          </button>
        </div>
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

export default EditArticle;
