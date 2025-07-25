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
import { createYearPrediction } from "../../../../store/slices/yearPredictions";
import { RootState } from "../../../../store";
import {
  createMissingNumberRemedy,
  fetchMissingNumberRemedyById,
  updateMissingNumberRemedy,
} from "../../../../store/slices/missingNumber";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";

const EditMissingNumber: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedRemedy, loading, error } = useSelector(
    (state: RootState) => state.rashi
  );

  // Form state - updated to match your requirements
  const [missing_number, setMissingNumber] = useState("");
  const [text, setText] = useState("");
  const [textEn, setTextEn] = useState("");
  const [textHi, setTextHi] = useState("");

  const location = useLocation();
  const missingNumberId = location.state?.missingNumberId;
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Editor state - updated to handle text, textEn, and textHi
  const [activeLanguage, setActiveLanguage] = useState<"en" | "hi">("en");
  const [previewMode, setPreviewMode] = useState(false);
  const [activeEditor, setActiveEditor] = useState<
    "text" | "textEn" | "textHi"
  >("text");

  // Markdown helper functions
  const insertMarkdown = (
    before: string,
    after: string = "",
    placeholder: string = ""
  ) => {
    let textareaId = "";

    // Determine the correct textarea ID based on active editor
    switch (activeEditor) {
      case "text":
        textareaId = "text_field";
        break;
      case "textEn":
        textareaId = "text_en_field";
        break;
      case "textHi":
        textareaId = "text_hi_field";
        break;
    }

    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
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
    switch (activeEditor) {
      case "text":
        setText(newValue);
        break;
      case "textEn":
        setTextEn(newValue);
        break;
      case "textHi":
        setTextHi(newValue);
        break;
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
        id: missingNumberId,
        data: {
          missing_number: missing_number,
          text: text,
          text_en: textEn,
          text_hi: textHi,
        },
      })
    ).then((action: any) => {
      if (updateMissingNumberRemedy.fulfilled.match(action)) {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 2500);
      }
    });
  };

  const getData = async () => {
    if (missingNumberId) {
      console.log("Fetching missing number by ID:", missingNumberId);
      const response = await dispatch(
        fetchMissingNumberRemedyById(missingNumberId)
      );
      const data = response.payload;
      if (fetchMissingNumberRemedyById.fulfilled.match(response)) {
        console.log("Fetched Missing Number:", data);
        setMissingNumber(data.missing_number || "");
        setText(data.text || "");
        setTextEn(data.text_en || "");
        setTextHi(data.text_hi || "");
      } else {
        toast.error("Failed to fetch missing number");
      }
    } else {
      // If no missingNumberId is provided, redirect to content/all
      toast.error("No Missing Number ID provided");
      navigate("/numerology/personality/list");
    }
  };

  useEffect(() => {
    getData();
  }, [dispatch, missingNumberId, navigate]);

  console.log("Selected Missing Number:", selectedRemedy);
  useEffect(() => {
    if (selectedRemedy) {
      setMissingNumber(selectedRemedy.missing_number || "");
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
        {/* Language and Editor Controls */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <label className="text-sm font-medium text-gray-700">Editor:</label>
            <select
              value={activeEditor}
              onChange={(e) =>
                setActiveEditor(e.target.value as "text" | "textEn" | "textHi")
              }
              className="px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="text">Text</option>
              <option value="textEn">Text (English)</option>
              <option value="textHi">Text (Hindi)</option>
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
              type="text"
              value={missing_number}
              onChange={(e) => setMissingNumber(e.target.value)}
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

        {/* Text Fields */}
        <div className="space-y-6 mb-6">
          {/* Text Field */}
          <div>
            <label
              htmlFor="text_field"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Text *{" "}
              {activeEditor === "text" && (
                <span className="text-blue-600 text-xs">← Active</span>
              )}
            </label>
            {previewMode && activeEditor === "text" ? (
              <div
                className="min-h-[200px] p-4 border border-gray-300 rounded-md overflow-auto prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(text),
                }}
              />
            ) : (
              <textarea
                id="text_field"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => setActiveEditor("text")}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm"
                rows={8}
                placeholder="Enter text content..."
              />
            )}
            {formErrors.text && (
              <p className="mt-1 text-sm text-red-600">{formErrors.text}</p>
            )}
          </div>

          {/* Text (English) Field */}
          <div>
            <label
              htmlFor="text_en_field"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Text (English) *{" "}
              {activeEditor === "textEn" && (
                <span className="text-blue-600 text-xs">← Active</span>
              )}
            </label>
            {previewMode && activeEditor === "textEn" ? (
              <div
                className="min-h-[200px] p-4 border border-gray-300 rounded-md overflow-auto prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(textEn),
                }}
              />
            ) : (
              <textarea
                id="text_en_field"
                value={textEn}
                onChange={(e) => setTextEn(e.target.value)}
                onFocus={() => setActiveEditor("textEn")}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm"
                rows={8}
                placeholder="Enter English text content..."
              />
            )}
            {formErrors.textEn && (
              <p className="mt-1 text-sm text-red-600">{formErrors.textEn}</p>
            )}
          </div>

          {/* Text (Hindi) Field */}
          <div>
            <label
              htmlFor="text_hi_field"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Text (Hindi) *{" "}
              {activeEditor === "textHi" && (
                <span className="text-blue-600 text-xs">← Active</span>
              )}
            </label>
            {previewMode && activeEditor === "textHi" ? (
              <div
                className="min-h-[200px] p-4 border border-gray-300 rounded-md overflow-auto prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(textHi),
                }}
              />
            ) : (
              <textarea
                id="text_hi_field"
                value={textHi}
                onChange={(e) => setTextHi(e.target.value)}
                onFocus={() => setActiveEditor("textHi")}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm"
                rows={8}
                placeholder="हिंदी टेक्स्ट सामग्री दर्ज करें..."
              />
            )}
            {formErrors.textHi && (
              <p className="mt-1 text-sm text-red-600">{formErrors.textHi}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Missing Number"}
        </button>

        {updateSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium text-center">
            Missing number updated successfully!
          </div>
        )}
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default EditMissingNumber;
