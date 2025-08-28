import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState, AppDispatch } from "../../store";
import {
  fetchAdvancedAnalysis,
  fetchAdvancedQuestions,
  addAdvancedQuestion,
  updateAdvancedAnalysis,
} from "../../store/slices/advance";
import { Pencil, X, Plus } from "lucide-react";
import TiptapEditor from "../../components/TiptapEditor";

// Helper to sanitize HTML content (optional - for security)
const sanitizeHTML = (str: string) => {
  // Basic sanitization - you might want to use a library like DOMPurify for production
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Helper to check if content is empty (ignoring HTML tags)
const isContentEmpty = (str: string) => {
  const textContent = str.replace(/<[^>]+>/g, '').trim();
  return !textContent || textContent === '';
};

const AdvanceDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { analysis, questions, loading, error } = useSelector(
    (state: RootState) => state.advance
  );
  const token = useSelector((state: RootState) => state.auth.token);

  const topic = location.state?.topicName?.toLowerCase() || "sun";

  // --- Analysis modal state ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalField, setModalField] = useState("");
  const [modalValue, setModalValue] = useState("");

  // --- Add Question modal state ---
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [newQuestionEn, setNewQuestionEn] = useState("");
  const [newQuestionHi, setNewQuestionHi] = useState("");

  // --- Analysis editable state ---
  const [analysisData, setAnalysisData] = useState<any>({
    symptoms_en: "<p></p>",
    symptoms_hi: "<p></p>",
    remedy_en: "<p></p>",
    remedy_hi: "<p></p>",
  });

  // --- Fetch data ---
  useEffect(() => {
    if (token) {
      dispatch(fetchAdvancedAnalysis({ topic, token }));
      dispatch(fetchAdvancedQuestions({ topic, token }));
    }
  }, [dispatch, topic, token]);

  useEffect(() => {
    if (analysis) {
      setAnalysisData({
        symptoms_en: analysis.symptoms_en || "<p></p>",
        symptoms_hi: analysis.symptoms_hi || "<p></p>",
        remedy_en: analysis.remedy_en || "<p></p>",
        remedy_hi: analysis.remedy_hi || "<p></p>",
      });
    }
  }, [analysis]);

  // --- Analysis modal handlers ---
  const openModal = (field: string, value: string) => {
    setModalField(field);
    setModalValue(value || "<p></p>");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalField("");
    setModalValue("");
  };

  const handleModalSave = () => {
    setAnalysisData((prev: any) => ({ ...prev, [modalField]: modalValue }));
    closeModal();
  };

  const handleUpdate = () => {
    if (!token) return;
    dispatch(updateAdvancedAnalysis({ topic, payload: analysisData, token }));
  };

  // --- Add Question handlers ---
  const handleAddQuestion = () => {
    if (!newQuestionEn && !newQuestionHi) return;
    if (!token) return;

    dispatch(
      addAdvancedQuestion({
        topic,
        payload: { question_en: newQuestionEn, question_hi: newQuestionHi },
        token,
      })
    );

    setNewQuestionEn("");
    setNewQuestionHi("");
    setQuestionModalOpen(false);
  };

  // Component to render HTML content safely
  const HTMLContent = ({ content }: { content: string }) => {
    if (isContentEmpty(content)) {
      return <span className="text-gray-400 italic">No content available</span>;
    }
    
    return (
      <div 
        className="prose prose-sm max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ 
          __html: sanitizeHTML(content) 
        }}
        style={{
          // Custom styles for better rendering
          lineHeight: '1.6',
          fontSize: '14px'
        }}
      />
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg">
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">
        Planet: {topic.charAt(0).toUpperCase() + topic.slice(1)}
      </h2>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-red-600 font-medium">Error:</div>
            <div className="ml-2 text-red-700">{error}</div>
          </div>
        </div>
      )}

      {/* Questions Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Questions</h2>
          <button
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-1 transition-colors"
            onClick={() => setQuestionModalOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add Question
          </button>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-lg mb-2">No questions found</div>
            <div className="text-sm">Click "Add Question" to create your first question</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map((question, index) => (
              <div
                key={question.question_en + index}
                className="border border-gray-200 p-4 rounded-lg relative group cursor-pointer  transition-all duration-200"
              >
                {/* English Question (default view) */}
                <div className="text-gray-700 text-sm whitespace-pre-wrap break-words group-hover:hidden">
                  <span className="font-semibold text-black-600">{index + 1}.</span>{" "}
                  {question.question_en || "-"}
                </div>
                
                {/* Hindi Question (hover view) */}
                <div className="text-gray-700 text-sm whitespace-pre-wrap break-words hidden group-hover:block">
                  <span className="font-semibold text-black-600">{index + 1}.</span>{" "}
                  {question.question_hi || "-"}
                </div>
                
                {/* Language indicator */}
               
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analysis Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-5">Analysis </h2>
        
        {/* Symptoms Row */}
<div className="mb-6">
  <h3 className="text-lg font-medium mb-3 text-gray-800">Symptoms</h3>

  <div className="flex gap-6">
    {/* Symptoms English */}
    <div className="flex-1 border border-gray-200 p-4 rounded-lg relative hover:shadow-sm transition-shadow">
      <button
        onClick={() => openModal("symptoms_en", analysisData.symptoms_en)}
        className="absolute top-2 right-2 text-blue-600 hover:text-blue-800 transition-colors"
        title="Edit Symptoms (English)"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <div className="p-2">
        <HTMLContent content={analysisData.symptoms_en} />
      </div>
    </div>

    {/* Symptoms Hindi */}
    <div className="flex-1 border border-gray-200 p-4 rounded-lg relative hover:shadow-sm transition-shadow">
      <button
        onClick={() => openModal("symptoms_hi", analysisData.symptoms_hi)}
        className="absolute top-2 right-2 text-blue-600 hover:text-blue-800 transition-colors"
        title="Edit Symptoms (Hindi)"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <div className="p-2">
        <HTMLContent content={analysisData.symptoms_hi} />
      </div>
    </div>
  </div>
</div>



        {/* Remedies Row */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-gray-800">Remedies</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Remedy English */}
            <div className="border border-gray-200 p-4 rounded-lg relative hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-700">English</h4>
                <button
                  onClick={() => openModal("remedy_en", analysisData.remedy_en)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Edit Remedy (English)"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <div className="min-h-[100px]">
                <HTMLContent content={analysisData.remedy_en} />
              </div>
            </div>

            {/* Remedy Hindi */}
            <div className="border border-gray-200 p-4 rounded-lg relative hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-700">Hindi</h4>
                <button
                  onClick={() => openModal("remedy_hi", analysisData.remedy_hi)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Edit Remedy (Hindi)"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <div className="min-h-[100px]">
                <HTMLContent content={analysisData.remedy_hi} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Button */}
      <div className="flex justify-end mt-8">
        <button
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            "Save Analysis & Remedy"
          )}
        </button>
      </div>

      {/* --- Analysis Edit Modal --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[70vh] overflow-y-auto relative m-4">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </button>
            
            <h3 className="text-xl font-bold mb-4 pr-8">
              Edit {modalField.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            </h3>
            
            <div className="mb-6">
              <TiptapEditor
                value={modalValue}
                onChange={setModalValue}
                height="400px"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleModalSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Add Question Modal --- */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative m-4">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setQuestionModalOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            
            <h3 className="text-xl font-bold mb-6 pr-8">Add New Question</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Question (English)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  value={newQuestionEn}
                  onChange={(e) => setNewQuestionEn(e.target.value)}
                  placeholder="Enter question in English..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Question (हिन्दी)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  value={newQuestionHi}
                  onChange={(e) => setNewQuestionHi(e.target.value)}
                  placeholder="प्रश्न हिन्दी में लिखें..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setQuestionModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                onClick={handleAddQuestion}
                disabled={!newQuestionEn && !newQuestionHi}
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvanceDetails;