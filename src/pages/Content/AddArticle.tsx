import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createArticle } from "../../store/slices/content";
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

const AddArticle: React.FC = () => {
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
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.content);

  // Form state
  const [title, setTitle] = useState("");
  const [titleHi, setTitleHi] = useState("");
  const [content, setContent] = useState("");
  const [contentHi, setContentHi] = useState("");
  const [category, setCategory] = useState("");
  // Tags state as array of strings (IDs)
  const [tags, setTags] = useState<string[]>([]);
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
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [addedSuccess, setAddedSuccess] = useState(false);

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
    formData.append("title", title);
    formData.append("title_hi", titleHi);
    formData.append("content", content);
    formData.append("content_hi", contentHi);
    // Join tags as comma-separated string for backend
    formData.append("tags", tags.join(","));
    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (image) formData.append("image", image);

    const token = localStorage.getItem("token") || "";
    const baseUrl = import.meta.env.VITE_BASE_URL || "";
    dispatch(createArticle({ token, baseUrl, formData })).then(
      (action: any) => {
        if (createArticle.fulfilled.match(action)) {
          setAddedSuccess(true);
          setTitle("");
          setTitleHi("");
          setContent("");
          setContentHi("");
          setTags([]);
          setThumbnail(null);
          setImage(null);
          setTimeout(() => setAddedSuccess(false), 2500);
        }
      }
    );
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

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Edit3 className="h-8 w-8" />
        Add Article - Markdown Editor
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
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            {/* Content Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
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
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(content),
                    }}
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
                    rows={10}
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
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(contentHi),
                    }}
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
                    rows={10}
                    placeholder="यहाँ अपना मार्कडाउन कंटेंट लिखें..."
                  />
                )}
              </div>
            </div>

            {/* Other fields */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
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
                      maxHeight: 370,
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
          {/* File uploads */}
          <div className="content-center">
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
                {/* Show preview of uploaded thumbnail */}
                {thumbnail && (
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-sm text-gray-600">Preview:</span>
                    <img
                      src={URL.createObjectURL(thumbnail)}
                      alt="Thumbnail Preview"
                      className="h-[150px] w-3xs object-cover rounded border border-gray-300"
                    />
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
                {/* Show preview of uploaded image */}
                {image && (
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-sm text-gray-600">Preview:</span>
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Image Preview"
                      className="h-[150px] w-3xs object-cover rounded border border-gray-300"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg"
          aria-label="Add article"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Article"}
        </button>
        {addedSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium text-center">
            Article added successfully!
          </div>
        )}
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default AddArticle;
