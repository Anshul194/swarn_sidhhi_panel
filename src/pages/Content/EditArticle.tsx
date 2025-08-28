import React, { useEffect, useState, useRef } from "react";
import TiptapEditor from "../../components/TiptapEditor";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchArticleById, updateArticle, fetchArticleComments } from "../../store/slices/content";
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
  Pencil,
} from "lucide-react";
import { fetchTags } from "../../store/slices/tag";

const EditArticle: React.FC = () => {
  // Content Hi Edit Modal state
  const [showContentHiEditModal, setShowContentHiEditModal] = useState(false);
  const [modalContentHiValue, setModalContentHiValue] = useState("");
  // Tiptap editor for Content (Hindi)
  const [tiptapModalContentHi, setTiptapModalContentHi] = useState("");
  const tiptapEditorContentHi = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Heading,
      ListItem,
      BulletList,
      OrderedList,
      Blockquote,
      CodeBlock,
    ],
    content: tiptapModalContentHi,
    onUpdate: ({ editor }) => {
      setTiptapModalContentHi(editor.getHTML());
    },
    editable: true,
  });
  const handleOpenContentHiEdit = () => {
    setModalContentHiValue(contentHi);
    setTiptapModalContentHi(contentHi);
    setShowContentHiEditModal(true);
    setTimeout(() => {
      if (tiptapEditorContentHi)
        tiptapEditorContentHi.commands.setContent(contentHi || "");
    }, 100);
  };
  const handleSaveContentHiEdit = () => {
    setContentHi(tiptapModalContentHi);
    setShowContentHiEditModal(false);
  };
  // Content Edit Modal state
  const [showContentEditModal, setShowContentEditModal] = useState(false);
  // Removed unused modalContentValue state
  // Tiptap editor state for modal
  const [tiptapModalContent, setTiptapModalContent] = useState("");
  const tiptapEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Heading,
      ListItem,
      BulletList,
      OrderedList,
      Blockquote,
      CodeBlock,
    ],
    content: tiptapModalContent,
    onUpdate: ({ editor }) => {
      setTiptapModalContent(editor.getHTML());
    },
    editable: true,
  });
  const handleOpenContentEdit = () => {
    setTiptapModalContent(content);
    setShowContentEditModal(true);
    setTimeout(() => {
      if (tiptapEditor) tiptapEditor.commands.setContent(content || "");
    }, 100);
  };
  const handleSaveContentEdit = () => {
    setContent(tiptapModalContent);
    setShowContentEditModal(false);
  };
  // State for custom tag input
  const [customTagInput, setCustomTagInput] = useState("");

  // Handler to add custom tag
  const handleAddCustomTag = () => {
    const trimmed = customTagInput.trim();
    if (
      trimmed &&
      !tags.includes(trimmed) &&
      !fetchedTags?.some(
        (t: { id: string | number; name: string }) => t.name === trimmed
      )
    ) {
      setTags((prev: string[]) => [...prev, trimmed]);
      setCustomTagInput("");
    }
  };
  const location = useLocation();
  const navigate = useNavigate();
  const articleId = location.state?.articleId;
  const dispatch = useDispatch();
  const { selectedArticle, loading, error, comments } = useSelector(
    (state: RootState) => state.content
  );
  // Dropdown state for tags
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);

  // Ref for dropdown to handle outside click
  const tagsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        tagsDropdownRef.current &&
        !tagsDropdownRef.current.contains(e.target as Node)
      ) {
        setShowTagsDropdown(false);
      }
    };
    if (showTagsDropdown) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showTagsDropdown]);

  // Form state
  const [title, setTitle] = useState("");
  const [titleHi, setTitleHi] = useState("");
  const [content, setContent] = useState("");
  const [contentHi, setContentHi] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [articleLoaded, setArticleLoaded] = useState(false);

  const { tags: fetchedTags } = useSelector((state: any) => state?.tag);

  // Editor state
  const [activeLanguage, setActiveLanguage] = useState<"en" | "hi">("en");
  const [previewMode] = useState(true);

  // Title Edit Modal state
  const [showTitleEditModal, setShowTitleEditModal] = useState(false);
  const [modalTitleValue, setModalTitleValue] = useState("");
  // Tiptap editor for Title (English)
  const [tiptapModalTitle, setTiptapModalTitle] = useState("");
  const tiptapEditorTitle = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Heading,
      ListItem,
      BulletList,
      OrderedList,
      Blockquote,
      CodeBlock,
    ],
    content: tiptapModalTitle,
    onUpdate: ({ editor }) => {
      setTiptapModalTitle(editor.getHTML());
    },
    editable: true,
  });
  const handleOpenTitleEdit = () => {
    setModalTitleValue(title);
    setTiptapModalTitle(title);
    setShowTitleEditModal(true);
    setTimeout(() => {
      if (tiptapEditorTitle) tiptapEditorTitle.commands.setContent(title || "");
    }, 100);
  };
  const handleSaveTitleEdit = () => {
    setTitle(tiptapModalTitle);
    setShowTitleEditModal(false);
  };
  // Title Hi Edit Modal state
  const [showTitleHiEditModal, setShowTitleHiEditModal] = useState(false);
  const [modalTitleHiValue, setModalTitleHiValue] = useState("");
  // Tiptap editor for Title (Hindi)
  const [tiptapModalTitleHi, setTiptapModalTitleHi] = useState("");
  const tiptapEditorTitleHi = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Heading,
      ListItem,
      BulletList,
      OrderedList,
      Blockquote,
      CodeBlock,
    ],
    content: tiptapModalTitleHi,
    onUpdate: ({ editor }) => {
      setTiptapModalTitleHi(editor.getHTML());
    },
    editable: true,
  });
  const handleOpenTitleHiEdit = () => {
    setModalTitleHiValue(titleHi);
    setTiptapModalTitleHi(titleHi);
    setShowTitleHiEditModal(true);
    setTimeout(() => {
      if (tiptapEditorTitleHi)
        tiptapEditorTitleHi.commands.setContent(titleHi || "");
    }, 100);
  };
  const handleSaveTitleHiEdit = () => {
    setTitleHi(tiptapModalTitleHi);
    setShowTitleHiEditModal(false);
  };
  useEffect(() => {
    // Fetch tags when component mounts
    if (!fetchedTags.length) {
      dispatch(fetchTags());
    }
  }, [dispatch, fetchedTags.length]);

  // Fetch article when component mounts
  useEffect(() => {
    if (articleId) {
      const token = localStorage.getItem("token") || "";
      const baseUrl = import.meta.env.VITE_BASE_URL || "";
      dispatch(fetchArticleById({ token, baseUrl, articleId }));
      // Fetch comments for the article
      dispatch(fetchArticleComments({ token, baseUrl, articleId }));
    } else {
      // If no articleId is provided, redirect to content/all
      toast.error("No article ID provided");
      navigate("/content/all");
    }
  }, [dispatch, articleId, navigate]);

  // Populate form fields when selectedArticle changes
  useEffect(() => {
    if (selectedArticle) {
      setTitle(selectedArticle.title_en || "");
      setTitleHi(selectedArticle.title_hi || "");
      setContent(selectedArticle.content_en || "");
      setContentHi(selectedArticle.content_hi || "");
      setCategory(selectedArticle.category || "");
      setTags(
        Array.isArray(selectedArticle.tags)
          ? selectedArticle.tags.map(String)
          : []
      );
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
    // Only support content fields now
    const textarea = document.getElementById(
      activeLanguage === "en" ? "content" : "content_hi"
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
      setContent(newValue);
    } else {
      setContentHi(newValue);
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
    // category is NOT required anymore
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
      formData.append("title_en", title);
      formData.append("title_hi", titleHi);
      formData.append("content_en", content);
      formData.append("content_hi", contentHi);
      formData.append("category", category);
      // tags: send as array of IDs
      tags.forEach((tagId) => formData.append("tags[]", tagId));
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
          duration: 3000,
          pauseOnHover: true,
          draggable: true,
        });

        // Navigate after showing success message
        setTimeout(() => {
          navigate("/content/all");
        }, 2000);
      } else {
        // Try to get error message from resultAction
        let errorMsg = "Failed to update article. Please try again.";
        if (resultAction && typeof resultAction === "object") {
          if ("payload" in resultAction && resultAction.payload) {
            const payload = resultAction.payload as { message?: string };
            errorMsg = payload.message || errorMsg;
          }
        }
        toast.error(errorMsg, {
          position: "top-right",
          duration: 5000,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-right",
        duration: 5000,
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
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>
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

        {/* Language Control Only */}
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
        </div>

        {/* Markdown Toolbar
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
        )} */}

        {/* Title Fields - always show both, no activeEditor logic */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
          <div>
            <label
              htmlFor="title"
              className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2"
            >
              Title (English)
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
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
            {/* Title Edit Modal Popup with Tiptap */}
            {showTitleEditModal && (
              <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    Edit Title (English)
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
              className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2"
            >
              Title (Hindi)
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
              <input
                id="title_hi"
                type="text"
                value={titleHi}
                onChange={(e) => setTitleHi(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            )}
            {/* Title Hi Edit Modal Popup with Tiptap */}
            {showTitleHiEditModal && (
              <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-30 backdrop-blur z-[100]">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    Edit Title (Hindi)
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            {/* Content Fields - always show, no activeEditor logic */}
            <div className="grid grid-cols-1 gap-6 mb-6 ">
              <div>
                <label
                  htmlFor="content"
                  className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2"
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
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(content),
                    }}
                  />
                ) : (
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm"
                    rows={10}
                    aria-required="true"
                    aria-describedby="content-error"
                    placeholder="Enter your markdown content here..."
                  />
                )}
                {/* Content Edit Modal Popup */}
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
                {formErrors.content && (
                  <p id="content-error" className="mt-1 text-sm text-red-600">
                    {formErrors.content}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="content_hi"
                  className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2"
                >
                  Content (Hindi) {/* No activeEditor logic, always show */}
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
                    dangerouslySetInnerHTML={{ __html: contentHi }}
                  />
                ) : (
                  <textarea
                    id="content_hi"
                    value={contentHi}
                    onChange={(e) => setContentHi(e.target.value)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm"
                    rows={10}
                    aria-required="true"
                    aria-describedby="content-error"
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

            {/* Other fields */}
            <div className="grid grid-cols-1 gap-6 mb-6">
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
                  aria-describedby="category-error"
                />
                {/* Remove category error display */}
                {/* {formErrors.category && (
                  <p id="category-error" className="mt-1 text-sm text-red-600">
                    {formErrors.category}
                  </p>
                )} */}
              </div>

              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tags (comma-separated):
                </label>
                {/* Custom dropdown with checkboxes for tags and custom tag add */}
                <div className="relative" ref={tagsDropdownRef}>
                  {/* Dropdown opens upward, taller, sticky add section (fixed) */}
                  <div
                    className={`absolute z-10 bottom-full mb-1 w-full bg-white border border-gray-300 rounded-md shadow-lg transition-all duration-150 ${
                      showTagsDropdown ? "block" : "hidden"
                    }`}
                    style={{
                      minHeight: 120,
                      height: 370,
                      display: showTagsDropdown ? "block" : "none",
                    }}
                  >
                    {/* Sticky add section at the top, outside scrollable area */}
                    <div
                      className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50 sticky top-0 z-20"
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 20,
                        background: "#f9fafb",
                      }}
                    >
                      <input
                        type="text"
                        value={customTagInput}
                        onChange={(e) => setCustomTagInput(e.target.value)}
                        placeholder="Add custom tag"
                        className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomTag();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                        onClick={handleAddCustomTag}
                      >
                        Add
                      </button>
                    </div>
                    {/* Scrollable tag list below sticky add section */}
                    <div className="max-h-[320px] overflow-auto">
                      {fetchedTags?.length ? (
                        fetchedTags.map(
                          (item: { id: string | number; name: string }) => (
                            <label
                              key={item.id}
                              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={tags.includes(String(item.id))}
                                onChange={() => {
                                  setTags((prev: string[]) =>
                                    prev.includes(String(item.id))
                                      ? prev.filter(
                                          (id) => id !== String(item.id)
                                        )
                                      : [...prev, String(item.id)]
                                  );
                                }}
                                className="mr-2"
                              />
                              {item.name}
                            </label>
                          )
                        )
                      ) : (
                        <div className="px-3 py-2 text-gray-500">
                          No tags found
                        </div>
                      )}
                      {/* Show custom tags (not in fetchedTags) */}
                      {tags
                        .filter(
                          (id) =>
                            !fetchedTags?.some(
                              (t: { id: string | number; name: string }) =>
                                String(t.id) === String(id)
                            )
                        )
                        .map((customTag) => (
                          <label
                            key={customTag}
                            className="flex items-center px-3 py-2 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={true}
                              onChange={() => {
                                setTags((prev: string[]) =>
                                  prev.filter((id) => id !== customTag)
                                );
                              }}
                              className="mr-2"
                            />
                            <span className="italic text-blue-700">
                              {customTag}
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={
                      tags.length > 0
                        ? tags
                            .map(
                              (id) =>
                                fetchedTags?.find(
                                  (t: { id: string | number; name: string }) =>
                                    String(t.id) === String(id)
                                )?.name || id
                            )
                            .join(", ")
                        : ""
                    }
                    onClick={() => setShowTagsDropdown((v) => !v)}
                    placeholder="Select tags"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="content-center">
            {/* File uploads */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
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
                {/* Show preview of uploaded thumbnail or current thumbnail */}
                {(thumbnail || selectedArticle?.thumbnail) && (
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-sm text-gray-600">Preview:</span>
                    {thumbnail ? (
                      <img
                        src={URL.createObjectURL(thumbnail)}
                        alt="Thumbnail Preview"
                        className="h-[150px] w-3xs object-cover rounded border border-gray-300"
                      />
                    ) : (
                      <a
                        href={selectedArticle.thumbnail}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <img
                          src={selectedArticle.thumbnail}
                          alt="Current Thumbnail"
                          className="h-[150px] w-3xs object-cover rounded border border-gray-300"
                        />
                      </a>
                    )}
                  </div>
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
                {/* Show preview of uploaded image or current image */}
                {(image || selectedArticle?.image) && (
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-sm text-gray-600">Preview:</span>
                    {image ? (
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Image Preview"
                        className="h-[150px] w-3xs object-cover rounded border border-gray-300"
                      />
                    ) : (
                      <a
                        href={selectedArticle.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <img
                          src={selectedArticle.image}
                          alt="Current Image"
                          className="h-[150px] h-3xs w-3xs object-cover rounded border border-gray-300"
                        />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Stats Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Stats</h3>
          <div className="flex gap-8 mb-6">
            <div className="border rounded-lg px-8 py-6 flex flex-col items-center min-w-[150px]">
              <span className="text-3xl font-bold">
                {selectedArticle?.view_count ?? 0}
              </span>
              <span className="text-sm text-gray-500 mt-1">Views</span>
            </div>
            <div className="border rounded-lg px-8 py-6 flex flex-col items-center min-w-[150px]">
              <span className="text-2xl font-bold">
                {selectedArticle?.comment_count ?? 0}
              </span>
              <span className="text-sm text-gray-500 mt-1">Comments</span>
            </div>
            <div className="border rounded-lg px-8 py-6 flex flex-col items-center min-w-[150px]">
              <span className="text-2xl font-bold">
                {selectedArticle?.share_count ?? 0}
              </span>
              <span className="text-sm text-gray-500 mt-1">Shares</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Comments</h3>
          {/* Render comments if available, else show placeholder */}
          {comments && comments.length > 0 ? (
            <div className="grid gap-4">
              {comments.map((comment: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="font-semibold text-gray-800 mb-1">
                    {comment.user?.name || "Anonymous"}
                  </div>
                  <div className="text-gray-700 text-sm">{comment.comment}</div>
                  <div className="text-xs text-gray-400 mt-2">
                    {comment.created_at}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No comments yet.</div>
          )}
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
