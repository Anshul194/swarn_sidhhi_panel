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

// Helper to remove HTML tags
const stripHTML = (str: string) => str.replace(/<[^>]+>/g, "");

const AdvanceDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { analysis, questions, loading, error } = useSelector(
    (state: RootState) => state.advance
  );
  const token = useSelector((state: RootState) => state.auth.token);

  // Get topic from navigation state, fallback to "sun"
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
    symptoms_en: "",
    symptoms_hi: "",
    remedy_en: "",
    remedy_hi: "",
  });

  useEffect(() => {
    if (token) {
      dispatch(fetchAdvancedAnalysis({ topic, token }));
      dispatch(fetchAdvancedQuestions({ topic, token }));
    }
  }, [dispatch, topic, token]);

  useEffect(() => {
    if (analysis) {
      setAnalysisData({
        symptoms_en: stripHTML(analysis.symptoms_en || ""),
        symptoms_hi: stripHTML(analysis.symptoms_hi || ""),
        remedy_en: stripHTML(analysis.remedy_en || ""),
        remedy_hi: stripHTML(analysis.remedy_hi || ""),
      });
    }
  }, [analysis]);

  // --- Analysis modal handlers ---
  const openModal = (field: string, value: string) => {
    setModalField(field);
    setModalValue(value || "");
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg">
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">
        Planet: {topic.charAt(0).toUpperCase() + topic.slice(1)}
      </h2>

      {/* Questions Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Questions</h2>
          <button
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-1"
            onClick={() => setQuestionModalOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions.map((question, index) => (
            <div
              key={question.question_en + index}
              className="border p-4 rounded relative group cursor-pointer hover:shadow-lg transition"
            >
              {/* English shown by default */}
              <div className="text-gray-700 text-sm whitespace-pre-wrap break-words group-hover:hidden">
                {index + 1}. {question.question_en || "-"}
              </div>

              {/* Hindi shown on hover */}
              <div className="text-gray-700 text-sm whitespace-pre-wrap break-words hidden group-hover:block">
                {index + 1}. {question.question_hi || "-"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Section */}
     <div>
         <h2 className="text-xl font-semibold mb-5">Analysis</h2>
         

     </div>

      {/* Remedy Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border p-4 rounded relative">
          <h4 className="font-semibold mb-2">Remedy when Sun Weak (English)</h4>
          <div className="text-gray-700 text-sm whitespace-pre-wrap break-words">
            {analysisData.remedy_en || "-"}
          </div>
          <button
            onClick={() => openModal("remedy_en", analysisData.remedy_en)}
            className="absolute top-4 right-4 text-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        <div className="border p-4 rounded relative">
          <h4 className="font-semibold mb-2">Remedy when Sun Weak (Hindi)</h4>
          <div className="text-gray-700 text-sm whitespace-pre-wrap break-words">
            {analysisData.remedy_hi || "-"}
          </div>
          <button
            onClick={() => openModal("remedy_hi", analysisData.remedy_hi)}
            className="absolute top-4 right-4 text-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Update Button */}
      <div className="flex justify-end mt-8">
        <button
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow disabled:opacity-50"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Analysis & Remedy"}
        </button>
      </div>

      {/* --- Analysis Edit Modal --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-lg font-bold mb-4">
              Edit {modalField.replace(/_/g, " ")}
            </h3>
            <TiptapEditor value={modalValue} onChange={setModalValue} height="300px" />
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleModalSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Add Question Modal --- */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setQuestionModalOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-lg font-bold mb-4">Add New Question</h3>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Question (English)</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 text-sm"
                value={newQuestionEn}
                onChange={(e) => setNewQuestionEn(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Question (Hindi)</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 text-sm"
                value={newQuestionHi}
                onChange={(e) => setNewQuestionHi(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setQuestionModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleAddQuestion}
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default AdvanceDetails;
