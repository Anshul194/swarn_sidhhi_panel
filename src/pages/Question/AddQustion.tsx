import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createQuestion } from "../../store/slices/questionSlice";
import { AppDispatch, RootState } from "../../store";
import { useNavigate } from "react-router-dom";

// Define your available types
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

const AddQuestion = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.question);

  const [question_en, setQuestionEn] = useState("");
  const [question_hi, setQuestionHi] = useState("");
  const [type, setType] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    const result = await dispatch(
      createQuestion({ question_en, question_hi, type })
    );
    if (result.type.endsWith("fulfilled")) {
      setSuccess(true);
      setQuestionEn("");
      setQuestionHi("");
      setType("");
      setTimeout(() => {
        navigate("/questions");
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Question (English)</label>
          <input
            type="text"
            value={question_en}
            onChange={(e) => setQuestionEn(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Question (Hindi)</label>
          <input
            type="text"
            value={question_hi}
            onChange={(e) => setQuestionHi(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Question"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <p className="text-green-600">
            Question added successfully! Redirecting...
          </p>
        )}
      </form>
    </div>
  );
};

export default AddQuestion;
