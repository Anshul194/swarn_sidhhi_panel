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
  User,
} from "lucide-react";
import {
  fetchPersonalityById,
  updatePersonality,
} from "../../../../store/slices/personality";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { RootState } from "../../../../store";

const EditPersonality: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedPersonality, loading, error } = useSelector(
    (state: RootState) => state.personality
  );
  // Form state - removed title, titleHi, content, contentHi
  const [mulank, setMulank] = useState(0);
  const location = useLocation();
  const personalityId = location.state?.personalityId;
  const navigate = useNavigate();
  // Personality fields
  const [positiveSide, setPositiveSide] = useState("");
  const [positiveSideHi, setPositiveSideHi] = useState("");
  const [negativeSide, setNegativeSide] = useState("");
  const [negativeSideHi, setNegativeSideHi] = useState("");

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Editor state - updated to only include positive and negative
  const [activeLanguage, setActiveLanguage] = useState<"en" | "hi">("en");
  const [previewMode, setPreviewMode] = useState(false);
  const [activeEditor, setActiveEditor] = useState<"positive" | "negative">(
    "positive"
  );

  // Markdown helper functions
  const insertMarkdown = (
    before: string,
    after: string = "",
    placeholder: string = ""
  ) => {
    let textareaId = "";

    // Determine the correct textarea ID based on active language and editor
    if (activeLanguage === "en") {
      switch (activeEditor) {
        case "positive":
          textareaId = "positive_side";
          break;
        case "negative":
          textareaId = "negative_side";
          break;
      }
    } else {
      switch (activeEditor) {
        case "positive":
          textareaId = "positive_side_hi";
          break;
        case "negative":
          textareaId = "negative_side_hi";
          break;
      }
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
    if (activeLanguage === "en") {
      switch (activeEditor) {
        case "positive":
          setPositiveSide(newValue);
          break;
        case "negative":
          setNegativeSide(newValue);
          break;
      }
    } else {
      switch (activeEditor) {
        case "positive":
          setPositiveSideHi(newValue);
          break;
        case "negative":
          setNegativeSideHi(newValue);
          break;
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
                setActiveEditor(e.target.value as "positive" | "negative")
              }
              className="px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="positive">Positive Side</option>
              <option value="negative">Negative Side</option>
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

        {/* Name Field */}

        {/* Personality Section Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <User className="h-6 w-6" />
            Personality Traits
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Describe the positive and negative personality traits for this rashi
          </p>
        </div>
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
              Positive Side (English) *{" "}
              {activeLanguage === "en" && activeEditor === "positive" && (
                <span className="text-blue-600 text-xs">← Active</span>
              )}
            </label>
            {previewMode &&
            activeLanguage === "en" &&
            activeEditor === "positive" ? (
              <div
                className="min-h-[200px] p-4 border border-gray-300 rounded-md bg-green-50 overflow-auto prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(positiveSide),
                }}
              />
            ) : (
              <textarea
                id="positive_side"
                value={positiveSide}
                onChange={(e) => setPositiveSide(e.target.value)}
                onFocus={() => {
                  setActiveEditor("positive");
                  setActiveLanguage("en");
                }}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm bg-green-50"
                rows={10}
                placeholder="Describe positive personality traits using markdown..."
              />
            )}
            {formErrors.positiveSide && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.positiveSide}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="positive_side_hi"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Positive Side (Hindi){" "}
              {activeLanguage === "hi" && activeEditor === "positive" && (
                <span className="text-blue-600 text-xs">← Active</span>
              )}
            </label>
            {previewMode &&
            activeLanguage === "hi" &&
            activeEditor === "positive" ? (
              <div
                className="min-h-[200px] p-4 border border-gray-300 rounded-md bg-green-50 overflow-auto prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(positiveSideHi),
                }}
              />
            ) : (
              <textarea
                id="positive_side_hi"
                value={positiveSideHi}
                onChange={(e) => setPositiveSideHi(e.target.value)}
                onFocus={() => {
                  setActiveEditor("positive");
                  setActiveLanguage("hi");
                }}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm bg-green-50"
                rows={10}
                placeholder="सकारात्मक व्यक्तित्व लक्षणों का वर्णन करें..."
              />
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
              Negative Side (English) *{" "}
              {activeLanguage === "en" && activeEditor === "negative" && (
                <span className="text-blue-600 text-xs">← Active</span>
              )}
            </label>
            {previewMode &&
            activeLanguage === "en" &&
            activeEditor === "negative" ? (
              <div
                className="min-h-[200px] p-4 border border-gray-300 rounded-md bg-red-50 overflow-auto prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(negativeSide),
                }}
              />
            ) : (
              <textarea
                id="negative_side"
                value={negativeSide}
                onChange={(e) => setNegativeSide(e.target.value)}
                onFocus={() => {
                  setActiveEditor("negative");
                  setActiveLanguage("en");
                }}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm bg-red-50"
                rows={10}
                placeholder="Describe negative personality traits using markdown..."
              />
            )}
            {formErrors.negativeSide && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.negativeSide}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="negative_side_hi"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Negative Side (Hindi){" "}
              {activeLanguage === "hi" && activeEditor === "negative" && (
                <span className="text-blue-600 text-xs">← Active</span>
              )}
            </label>
            {previewMode &&
            activeLanguage === "hi" &&
            activeEditor === "negative" ? (
              <div
                className="min-h-[200px] p-4 border border-gray-300 rounded-md bg-red-50 overflow-auto prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(negativeSideHi),
                }}
              />
            ) : (
              <textarea
                id="negative_side_hi"
                value={negativeSideHi}
                onChange={(e) => setNegativeSideHi(e.target.value)}
                onFocus={() => {
                  setActiveEditor("negative");
                  setActiveLanguage("hi");
                }}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm bg-red-50"
                rows={10}
                placeholder="नकारात्मक व्यक्तित्व लक्षणों का वर्णन करें..."
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>

        {addedSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium text-center">
            Rashi added successfully!
          </div>
        )}
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default EditPersonality;
