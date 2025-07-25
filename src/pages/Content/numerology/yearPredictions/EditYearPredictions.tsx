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
  createYearPrediction,
  fetchYearPredictionById,
  updateYearPrediction,
} from "../../../../store/slices/yearPredictions";
import { RootState } from "../../../../store";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";

const EditYearPrediction: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedPrediction, loading, error } = useSelector(
    (state: RootState) => state.yearPredictions
  );

  // Form state - now includes all five fields
  const [mulank, setMulank] = useState(0);
  const [year, setYear] = useState(0);
  const location = useLocation();
  const yearPredictionId = location.state?.yearPredictionId;
  const navigate = useNavigate();

  // All prediction fields
  const [prediction, setPrediction] = useState("");
  const [predictionEn, setPredictionEn] = useState("");
  const [predictionHi, setPredictionHi] = useState("");

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Editor state - updated to handle all three prediction fields
  const [activeLanguage, setActiveLanguage] = useState<"en" | "hi">("en");
  const [previewMode, setPreviewMode] = useState(false);
  const [activeEditor, setActiveEditor] = useState<
    "prediction" | "predictionEn" | "predictionHi"
  >("prediction");

  // Markdown helper functions
  const insertMarkdown = (
    before: string,
    after: string = "",
    placeholder: string = ""
  ) => {
    let textareaId = "";

    // Determine the correct textarea ID based on active editor
    switch (activeEditor) {
      case "prediction":
        textareaId = "prediction";
        break;
      case "predictionEn":
        textareaId = "prediction_en";
        break;
      case "predictionHi":
        textareaId = "prediction_hi";
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
      case "prediction":
        setPrediction(newValue);
        break;
      case "predictionEn":
        setPredictionEn(newValue);
        break;
      case "predictionHi":
        setPredictionHi(newValue);
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

  // Validate form - now includes all prediction fields
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!year) errors.year = "Year number is required";
    if (!mulank) errors.mulank = "Mulank number is required";
    if (!prediction.trim()) errors.prediction = "Prediction is required";
    if (!predictionEn.trim())
      errors.predictionEn = "Prediction (English) is required";
    if (!predictionHi.trim())
      errors.predictionHi = "Prediction (Hindi) is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission - now includes all five fields
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Log the data being sent to debug
    const formData = {
      mulank_number: mulank,
      year_number: year,
      prediction: prediction, // General prediction
      prediction_en: predictionEn, // English prediction
      prediction_hi: predictionHi, // Hindi prediction
    };

    console.log("Form data being sent:", formData);

    dispatch(
      updateYearPrediction({
        id: yearPredictionId,
        data: formData,
      })
    ).then((action: any) => {
      if (updateYearPrediction.fulfilled.match(action)) {
        setAddedSuccess(true);
        toast.success("Year Prediction updated successfully!");
        setTimeout(() => setAddedSuccess(false), 2500);
      }
    });
  };

  const getData = async () => {
    if (yearPredictionId) {
      console.log("Fetching year prediction by ID:", yearPredictionId);
      const response = await dispatch(
        fetchYearPredictionById(yearPredictionId)
      );
      const data: any = response.payload;
      if (fetchYearPredictionById.fulfilled.match(response)) {
        console.log("Fetched Year Prediction:", data);

        // Set values with proper fallbacks and logging
        setMulank(data.mulank_number || 0);
        setYear(data.year_number || 0);

        // Handle prediction fields separately to avoid cross-contamination
        const generalPrediction = data.prediction || "";
        const englishPrediction = data.prediction_en || "";
        const hindiPrediction = data.prediction_hi || "";

        console.log("Setting prediction values:", {
          general: generalPrediction,
          english: englishPrediction,
          hindi: hindiPrediction,
        });

        setPrediction(generalPrediction);
        setPredictionEn(englishPrediction);
        setPredictionHi(hindiPrediction);
      } else {
        toast.error("Failed to fetch year prediction");
      }
    } else {
      // If no yearPredictionId is provided, redirect to content/all
      toast.error("No year prediction ID provided");
      navigate("/numerology/year-predictions/list");
    }
  };

  useEffect(() => {
    getData();
  }, [dispatch, yearPredictionId, navigate]);

  console.log("Selected Year Prediction:", selectedPrediction);
  useEffect(() => {
    if (selectedPrediction) {
      setMulank(selectedPrediction.mulank_number);
      setYear(selectedPrediction.year_number);
      setPrediction(selectedPrediction.prediction || "");
      setPredictionEn(
        selectedPrediction.prediction_en || selectedPrediction.prediction || ""
      );
      setPredictionHi(selectedPrediction.prediction_hi || "");
    }
  }, [selectedPrediction]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Edit3 className="h-8 w-8" />
        Edit Year Prediction - Markdown Editor
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
                setActiveEditor(
                  e.target.value as
                    | "prediction"
                    | "predictionEn"
                    | "predictionHi"
                )
              }
              className="px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="prediction">Prediction (General)</option>
              <option value="predictionEn">Prediction (English)</option>
              <option value="predictionHi">Prediction (Hindi)</option>
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

        {/* Year and Mulank Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="year_number"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Year Number*
            </label>
            <input
              id="year_number"
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {formErrors.year && (
              <p className="mt-1 text-sm text-red-600">{formErrors.year}</p>
            )}
          </div>
          <div>
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
        </div>

        {/* Prediction Fields */}
        <div className="space-y-6 mb-6">
          {/* General Prediction */}
          <div>
            <label
              htmlFor="prediction"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Prediction (General) *{" "}
              {activeEditor === "prediction" && (
                <span className="text-blue-600 text-xs">← Active</span>
              )}
            </label>
            {previewMode && activeEditor === "prediction" ? (
              <div
                className="min-h-[200px] p-4 border border-gray-300 rounded-md overflow-auto prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(prediction),
                }}
              />
            ) : (
              <textarea
                id="prediction"
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
                onFocus={() => setActiveEditor("prediction")}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm"
                rows={8}
                placeholder="Describe general prediction..."
              />
            )}
            {formErrors.prediction && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.prediction}
              </p>
            )}
          </div>

          {/* Prediction Fields in Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Prediction English */}
            <div>
              <label
                htmlFor="prediction_en"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Prediction (English) *{" "}
                {activeEditor === "predictionEn" && (
                  <span className="text-blue-600 text-xs">← Active</span>
                )}
              </label>
              {previewMode && activeEditor === "predictionEn" ? (
                <div
                  className="min-h-[200px] p-4 border border-gray-300 rounded-md overflow-auto prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(predictionEn),
                  }}
                />
              ) : (
                <textarea
                  id="prediction_en"
                  value={predictionEn}
                  onChange={(e) => setPredictionEn(e.target.value)}
                  onFocus={() => setActiveEditor("predictionEn")}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm"
                  rows={10}
                  placeholder="Describe prediction in English..."
                />
              )}
              {formErrors.predictionEn && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.predictionEn}
                </p>
              )}
            </div>

            {/* Prediction Hindi */}
            <div>
              <label
                htmlFor="prediction_hi"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Prediction (Hindi) *{" "}
                {activeEditor === "predictionHi" && (
                  <span className="text-blue-600 text-xs">← Active</span>
                )}
              </label>
              {previewMode && activeEditor === "predictionHi" ? (
                <div
                  className="min-h-[200px] p-4 border border-gray-300 rounded-md overflow-auto prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(predictionHi),
                  }}
                />
              ) : (
                <textarea
                  id="prediction_hi"
                  value={predictionHi}
                  onChange={(e) => setPredictionHi(e.target.value)}
                  onFocus={() => setActiveEditor("predictionHi")}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm"
                  rows={10}
                  placeholder="भविष्यवाणी का वर्णन हिंदी में करें..."
                />
              )}
              {formErrors.predictionHi && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.predictionHi}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Prediction"}
        </button>

        {addedSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium text-center">
            Year Prediction updated successfully!
          </div>
        )}
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default EditYearPrediction;
