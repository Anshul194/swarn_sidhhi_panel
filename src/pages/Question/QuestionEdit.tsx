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

  useEffect(() => {
    if (id) dispatch(fetchQuestionById(Number(id)));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedQuestion) setFormData(selectedQuestion);
  }, [selectedQuestion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    if (id) {
      dispatch(updateQuestion({ id: Number(id), data: formData }));
    }
  };

  const handleDelete = () => {
    if (id && window.confirm("Are you sure you want to delete this question?")) {
      dispatch(deleteQuestion(Number(id)));
      navigate("/questions");
    }
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 xl:px-10 xl:py-12 mx-auto max-w-xl">
      <h2 className="text-2xl font-bold mb-6">Edit Question</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleUpdate}
          >
            Update
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            type="button"
            className="px-4 py-2 border rounded hover:bg-gray-100"
            onClick={() => navigate("/questions")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionEdit;
