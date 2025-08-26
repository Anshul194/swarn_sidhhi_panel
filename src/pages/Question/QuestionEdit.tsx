import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuestionById,
  updateQuestion,
  deleteQuestion,
} from "../../store/slices/questionSlice";
import { RootState, AppDispatch } from "../../store";

// Same types as Add page
const questionTypes = [
  "T-F",
  "I-E",
  "E-I",
  "N-S",
  "S-N",
  "F-T",
  "P-J",
  "J-P",
];

const QuestionEdit = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { selectedQuestion, loading, error } = useSelector(
    (state: RootState) => state.question
  );

  const [formData, setFormData] = useState({
    question_en: "",
    question_hi: "",
    type: "",
  });

  const [success, setSuccess] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchQuestionById(Number(id)));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedQuestion) setFormData(selectedQuestion);
  }, [selectedQuestion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setSuccess(false);
    if (id) {
      const result = await dispatch(updateQuestion({ id: Number(id), data: formData }));
      if (result.type.endsWith("fulfilled")) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/questions");
        }, 1200);
      }
    }
  };

  const handleDelete = async () => {
    if (id) {
      await dispatch(deleteQuestion(Number(id)));
      setShowDeletePopup(false);
      navigate("/questions");
    }
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Question</h2>
      {loading && <p>Loading...</p>}
      <form className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Question (English)</label>
          <input
            type="text"
            name="question_en"
            value={formData.question_en}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Question (Hindi)</label>
          <input
            type="text"
            name="question_hi"
            value={formData.question_hi}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          >
            <option value="" disabled>
              Select Type
            </option>
            {questionTypes.map((qt) => (
              <option key={qt} value={qt}>
                {qt}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4 mt-4">
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => setShowDeletePopup(true)}
          >
            Delete
          </button>
          <button
            type="button"
            className="border px-4 py-2 rounded hover:bg-gray-100"
            onClick={() => navigate("/questions")}
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <p className="text-green-600">Question updated successfully! Redirecting...</p>
        )}
      </form>

      {showDeletePopup && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40"
            onClick={() => setShowDeletePopup(false)}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
              {/* Close Icon */}
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowDeletePopup(false)}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
              <p className="mb-6">Are you sure you want to delete this question?</p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setShowDeletePopup(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionEdit;
