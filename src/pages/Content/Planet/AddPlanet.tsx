import React, { useState } from "react";
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
import { createPlanet } from "../../../store/slices/planet";

import type { RootState } from "../../../store";
import type { AppDispatch } from "../../../store";

const AddPlanet: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.planet);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionHi, setDescriptionHi] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [shortDescriptionEn, setShortDescriptionEn] = useState("");
  const [shortDescriptionHi, setShortDescriptionHi] = useState("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [addedSuccess, setAddedSuccess] = useState(false);

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
    let textarea: HTMLTextAreaElement | null = null;
    if (activeLanguage === "en") {
      if (activeEditor === "content") {
        textarea = document.getElementById(
          "description_en"
        ) as HTMLTextAreaElement;
      } else {
        textarea = document.getElementById(
          "short_description_en"
        ) as HTMLTextAreaElement;
      }
    } else {
      if (activeEditor === "content") {
        textarea = document.getElementById(
          "description_hi"
        ) as HTMLTextAreaElement;
      } else {
        textarea = document.getElementById(
          "short_description_hi"
        ) as HTMLTextAreaElement;
      }
    }
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
        setDescriptionEn(newValue);
      } else {
        setShortDescriptionEn(newValue);
      }
    } else {
      if (activeEditor === "content") {
        setDescriptionHi(newValue);
      } else {
        setShortDescriptionHi(newValue);
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
    if (!name.trim()) errors.name = "Name is required";
    if (!descriptionEn.trim())
      errors.description_en = "Description (English) is required";
    if (!descriptionHi.trim())
      errors.description_hi = "Description (Hindi) is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(
      createPlanet({
        name,
        description: shortDescriptionEn, // fallback to English for main description
        description_en: descriptionEn,
        description_hi: descriptionHi,
      })
    ).then((action: any) => {
      if (createPlanet.fulfilled.match(action)) {
        setAddedSuccess(true);
        setName("");
        setDescription("");
        setDescriptionEn("");
        setDescriptionHi("");
        setShortDescription("");
        setShortDescriptionEn("");
        setShortDescriptionHi("");
        setTimeout(() => setAddedSuccess(false), 2500);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Edit3 className="h-8 w-8" />
        Add Planet - Markdown Editor
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
              Name (English){" "}
            </label>

            <select
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
            >
              <option value="">Select Planet</option>
              {[
                "sun",
                "moon",
                "mars",
                "mercury",
                "jupiter",
                "venus",
                "saturn",
                "rahu",
                "ketu",
              ].map((planet) => (
                <option key={planet} value={planet}>
                  {planet}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description (General){" "}
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
                id="short_description_en"
                value={shortDescriptionEn}
                onChange={(e) => setShortDescriptionEn(e.target.value)}
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
        </div>

        {/* Content Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description (English){" "}
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
                id="description_en"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
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
              Description (Hindi){" "}
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
                id="description_hi"
                value={descriptionHi}
                onChange={(e) => setDescriptionHi(e.target.value)}
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

        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg"
          aria-label="Add planet"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Planet"}
        </button>
        {addedSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium text-center">
            Planet added successfully!
          </div>
        )}
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default AddPlanet;
