import React, { useState } from "react";
import { Tag, Plus } from "lucide-react";
import { useAppDispatch } from "../../../hooks/redux";
import { createTag } from "../../../store/slices/tag";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const AddTag: React.FC = () => {
  // Simulated loading and error states
  const { loading, error } = useSelector((state: RootState) => state.tag); // Updated selector

  // Form state
  const [name, setName] = useState("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [addedSuccess, setAddedSuccess] = useState(false);
  const dispatch = useAppDispatch();
  // Validate form
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!name.trim()) {
      errors.name = "Tag name is required";
    } else if (name.trim().length < 2) {
      errors.name = "Tag name must be at least 2 characters long";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    // Simulate API call
    dispatch(createTag({ name })).then((action: any) => {
      if (createTag.fulfilled.match(action)) {
        setAddedSuccess(true);
        setName("");
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Tag className="h-8 w-8" />
        Add New Tag
      </h2>

      <div className="space-y-6">
        {/* Tag Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tag Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              formErrors.name
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Enter tag name..."
            aria-required="true"
            aria-describedby={formErrors.name ? "name-error" : undefined}
          />
          {formErrors.name && (
            <p id="name-error" className="mt-2 text-sm text-red-600">
              {formErrors.name}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Add tag"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Adding...
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Add Tag
            </>
          )}
        </button>

        {/* Success Message */}
        {addedSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
              Tag added successfully!
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 font-medium text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTag;
