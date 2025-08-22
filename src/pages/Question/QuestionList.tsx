import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestions } from "../../store/slices/questionSlice";
import { RootState, AppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";

const QuestionList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { questions, loading, error } = useSelector(
    (state: RootState) => state.question
  );

  // State to track which question is toggled
  const [showHindi, setShowHindi] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchQuestions({}));
  }, [dispatch]);

  const handleToggle = (id: number) => {
    setShowHindi(prev => (prev === id ? null : id)); // toggle on/off
  };

  return (
   <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 mx-auto">
  <h1 className="text-2xl font-bold mb-6">Questionnaire</h1>

  {loading && <p>Loading...</p>}
  {error && <p className="text-red-500">{error}</p>}

  {/* Add Question Button - aligned right */}
  <div className="flex justify-end mb-8">
    <button
      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      onClick={() => navigate("/questions/add")}
    >
      + Add Question
    </button>
  </div>

  <div className="space-y-4">
    {questions.map((q, index) => (
      <div
        key={q.id}
        className="border-b pb-4 flex flex-col md:flex-row md:justify-between md:items-center"
      >
        <div className="mb-2 md:mb-0">
          <span className="font-medium">{index + 1}. </span>
          {showHindi === q.id ? q.question_hi : q.question_en}
        </div>
        <button
          className="border px-3 py-1 rounded text-sm text-gray-700"
          onClick={() => handleToggle(q.id)}
        >
          {q.type}
        </button>
      </div>
    ))}
  </div>
</div>

  );
};

export default QuestionList;
